# How it works

The technical details.

## Where Claude Code keeps history

| Path | What |
|---|---|
| `~/.claude/projects/<encoded-path>/<session-uuid>.jsonl` | One file per session, one JSON object per line |
| `~/.claude/projects/<encoded-path>/<session-uuid>/subagents/*.jsonl` + `*.meta.json` | Subagent transcripts (synced as a "sidecar") |
| `~/.claude/projects/<encoded-path>/<session-uuid>/tool-results/*` | Large tool outputs saved to disk (sidecar) |
| `~/.claude/projects/<encoded-path>/memory/` | Project auto-memory (`MEMORY.md` + notes) |

Things that differ from the usual assumptions, all handled:

- **Drive-letter case differs by client.** The VS Code extension records `c:\Users\…` (folder `c--Users-…`), the CLI records `C:\Users\…` (folder `C--Users-…`), and one session can contain both. On Windows, paths are compared case-insensitively.
- **Folder names can't be decoded reliably.** `C:\Users\me\my project` and `C:\Users\me\my-project` both encode to `C--Users-me-my-project`. The real path comes from the `cwd` recorded in the sessions; decoding the name is only a labelled fallback.
- **Sessions can be huge** (200+ MB with embedded images/PDFs), so everything is streamed. Scan results are cached by size and modification time, so a rescan takes about 100 ms.
- **One assistant reply spans several lines** (one per content block, same `message.id`); message counts de-duplicate them. Titles come from the first real prompt (IDE wrapper tags stripped); Claude Code's own `ai-title` is shown next to it.
- **Many line types besides user/assistant** (`attachment`, `file-history-snapshot`, `queue-operation`, `ai-title`, `last-prompt`, `permission-mode`, …). Unknown types and fields are kept untouched.

## Where Codex keeps history

See [Codex support in detail](#codex-support-in-detail). Each line of a rollout is `{timestamp, type, payload}`; the first is `session_meta` with the session id and `cwd`. Codex has written conversations in three generations (`event_msg/item_completed` items in ≥0.15x, `user_message`/`agent_message` events earlier, plain `response_item` messages in the oldest); the viewer uses the richest one present.

## Adapters

Each AI tool is an **adapter** (`crates/core/src/providers/`) behind one interface (`ProviderAdapter`): detect the tool and its format, list projects and sessions, read a session into a tool-neutral shape (`UniversalSession`), export it losslessly (`SessionBundle`: the original files plus tool metadata such as the Codex index row), import it on another PC (rewrite paths, check the tool isn't running, back up, dry run), and append new lines. See [Adding another AI tool](#adding-another-ai-tool-adapter-guide).

## Project identity

The same project has a different path on each PC, so it is identified by, in order:

1. A **manual link** (Link button / `chatrelay link <dir> <id>`), stored in ChatRelay's config
2. The **git remote**, normalized: `git@github.com:Me/Repo.git` and `https://github.com/me/repo` both become `git:github.com/me/repo`
3. A **`.chatrelay.json`** in the project root holding a UUID, created on first push for non-git projects (commit it, or link manually on the other PC). "Upload everything" and background sync create a link in ChatRelay's config instead, so nothing is written into your project folders.

## Storage layout (in the folder or repo)

```
<projectId-slug>/
  manifest.json                          machines, original paths, hashes, timestamps, revision
  <sessionId>.jsonl.gz                   Claude Code session (whole, or its start when deltas exist)
  <sessionId>.d<N>.jsonl.gz              lines appended after that, one blob per push
  <sessionId>.sidecar.json.gz            subagents/ + tool-results/ (if any)
  memory.json.gz                         Claude Code project memory (if any)
  <provider>-<sessionId>.bundle.json.gz  another tool's session (e.g. codex-…): files + metadata
  <provider>-<sessionId>.d<N>.jsonl.gz   lines appended to it later
  .versions/<file>/<timestamp>           previous versions (folder backend)
```

Other tools' sessions are listed under `providerSessions` in the manifest (key `<provider>:<id>`). Older versions of the app ignore that list and keep it intact.

## Push

- Sessions are compared by SHA-256; only new or changed ones are uploaded. Originals are only ever read.
- **Only new lines are sent.** AI tools only ever append to a conversation file, so after a session's first upload a push stores just the lines added since the last sync as a "delta" part. Each part records the paths of the machine that pushed it. Session hashes are chained (`hash = sha256(previous : sha256(part))`). After 40 parts the next push uploads the whole session again. When the shortcut doesn't apply (the file changed some other way, a conflict, state from an older version) the whole file is uploaded.
- If the backend has a version you haven't seen that contains messages you don't have, that session's push is refused with "pull first", so nothing is lost.
- **Offline?** (GitHub unreachable, the cloud drive not mounted.) The push is queued in `~/.chatrelay/queue.json` and retried on the next run and every 15 minutes by the desktop app.

## Pull

- Paths are rewritten inside parsed JSON (string values **and** object keys), so JSON escaping is never a problem. Forms handled: Windows paths as `C:\…`, `c:/…`, Git-Bash `/c/…` and WSL `/mnt/c/…` (case-insensitive); POSIX paths (case-sensitive); `file:///` URLs including `%20`-encoded spaces; separators after the project root are converted when moving between operating systems; the tool's own home folder (`~/.claude`, `~/.codex`) and Claude Code's encoded folder name are rewritten too. Sibling folders such as `shop-old` are never touched.
- **Fast path:** a PC that has exactly what it last synced downloads only the missing parts and appends them.
- **Divergence** (conversations are append-only, compared by line ids for Claude Code and by text prefix for other tools):
  - remote contains local → update
  - local contains remote → yours is newer and is kept (uploaded on the next push)
  - both changed → **conflict**: your copy stays as it is, and the other version is saved as a **new conversation with a new id** (Codex: named "<name> (from <PC>)"). Both then appear in the tool and sync to your other PCs.

## Auto-sync hooks (Claude Code)

"Enable auto-sync" merges this into `~/.claude/settings.json`; your other settings and hooks are kept, and a backup is made first:

```jsonc
"hooks": {
  "SessionStart": [{ "hooks": [{ "type": "command", "command": "\"…/ChatRelay/chatrelay.exe\" pull --hook --quiet --chatrelay-hook", "timeout": 60 }] }],
  "SessionEnd":   [{ "hooks": [{ "type": "command", "command": "\"…/ChatRelay/chatrelay.exe\" push --hook --quiet --chatrelay-hook", "timeout": 60 }] }]
}
```

- `--hook` reads Claude Code's hook JSON from stdin (`cwd`, `session_id`), falling back to `CLAUDE_PROJECT_DIR` and then the working directory. Hooks **always exit 0**, so they can never break a session; errors go to the Logs panel.
- The hook runs the native `chatrelay` executable installed next to the app. No Node.js needed.
- "Disable auto-sync" removes only the hooks containing the `chatrelay-hook` marker.
