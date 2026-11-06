# CLI reference

Every chatrelay command.

The installer puts `chatrelay.exe` next to the app (`%LOCALAPPDATA%\ChatRelay\`). It is what the Claude Code hooks run. Add that folder to your `PATH` to use it anywhere. From source: `cargo run -p chatrelay-cli -- …`.

```
chatrelay scan [--json]                 List projects & sessions
chatrelay status [--json]               Backend, last sync, hooks, queue, cleanupPeriodDays
chatrelay push [--cwd <dir>] [--all] [--dry-run] [--redact]
chatrelay pull [--cwd <dir>] [--project <id>] [--all] [--dry-run]
chatrelay summarize [--cwd <dir>] [--model <id>] [--target handoff|claude-md|agents-md|gemini-md|none]
chatrelay remote                        List projects stored in the backend
chatrelay link <dir> <projectId>        Link a local folder to a remote project ID (--remove to unlink)
chatrelay search <words…> [--json]      Search every conversation (prompts and answers) on this PC
chatrelay storage [--compact]           Space used by the GitHub store; --compact removes old versions
chatrelay usage [--days N] [--json]     Tokens used by Claude Code and Codex on this PC, by model
chatrelay exclude [<dir>] [--remove]    Turn sync off (or back on) for a project on this PC; no <dir> lists them
chatrelay config [key] [value]          Show or set config (machineName, backend.folder, backend.github, secretScan, ...)
chatrelay secret set github-token|anthropic-api-key <value>
chatrelay hooks install|uninstall       Add/remove the SessionStart/SessionEnd hooks
chatrelay cleanup-days <n>              Set Claude Code's cleanupPeriodDays (backs up settings.json)
chatrelay backups [restore <id>]        List or restore backups
chatrelay queue                         Retry queued (offline) pushes

Any AI tool (provider = claude-code | codex | antigravity | cursor | kiro):
chatrelay providers [--json]            Which tools are installed, their version/format, import on/off
chatrelay providers sessions <provider> [--cwd <dir>] [--json]
chatrelay providers show <provider> <id> [--json]      Read a session in the tool-neutral format
chatrelay providers export <provider> <id> --out <file.json.gz>
chatrelay providers import <file.json.gz> --to <dir> [--dry-run]

Flags: --hook (read Claude Code hook JSON from stdin; never fails), --quiet, --json, --verbose
```

Exit codes: `0` OK, `1` error, `2` push had conflicts (pull first).

Environment variables:

| Variable | Effect |
|---|---|
| `CHATRELAY_HOME` | ChatRelay's own data folder (default `~/.chatrelay`) |
| `CLAUDE_CONFIG_DIR` | Claude Code's folder (default `~/.claude`) |
| `CODEX_HOME` | Codex's folder (default `~/.codex`) |
| `ANTHROPIC_API_KEY` | Used for summaries when no key is saved in the keychain |
| `GITHUB_TOKEN` | Used by the release script |
