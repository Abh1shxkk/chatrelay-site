# Supported AI tools

What works with each tool.

| Tool | Where it runs | View chats | Sync between PCs | Restore into the tool | Context file |
|---|---|---|---|---|---|
| **Claude Code** | Terminal CLI, VS Code extension | ✅ | ✅ (with auto-sync hooks) | ✅ `claude --resume`, VS Code history | `CLAUDE.md` |
| **OpenAI Codex** | Codex CLI, VS Code extension, Codex desktop app | ✅ | ✅ (upload ~1 min after a chat goes quiet, download every 15 min) | ✅ `codex resume`, Codex sidebar | `AGENTS.md` |
| **Antigravity** | Antigravity IDE, Antigravity CLI | ✅ | ✅ read-only: viewable, searchable and summarizable on every device | ❌ (not written back into Antigravity) | `GEMINI.md` |
| Gemini CLI | Terminal | ❌ Google no longer lets personal accounts sign in to it (they are moved to Antigravity, supported above) | | | `GEMINI.md` (summary target available) |
| **Cursor** | Cursor editor (Agent chat), Cursor CLI | ✅ | ✅ read-only: viewable, searchable and summarizable on every device | ❌ (not written back into Cursor) | `AGENTS.md` |
| **Kiro** | Kiro editor (agent chat), Kiro CLI | ✅ | ✅ read-only: viewable, searchable and summarizable on every device | ❌ (not written back into Kiro) | `AGENTS.md` |

Each tool keeps its history in its own undocumented format, and those formats change between versions. So ChatRelay checks the format it finds on your PC. If it sees a version it doesn't know, it still shows the conversations, but **turns off writing** for that tool and tells you why in **Settings → AI tools**. It never guesses.

Verified versions: Claude Code 2.1.x; Codex 0.144 to 0.160 (index database `state_5.sqlite`, schema migration 58); Antigravity 2.6; Cursor 3.28 and its CLI; Kiro 1.4 and Kiro CLI 3.1.

## Codex support in detail

What travels with each Codex conversation:

| Item | Where Codex keeps it | What ChatRelay does |
|---|---|---|
| The conversation ("rollout") | `~/.codex/sessions/YYYY/MM/DD/rollout-<time>-<id>.jsonl` (some versions write `.jsonl.zst`, compressed) | Copied, every path rewritten |
| The thread's index row | `~/.codex/state_5.sqlite`, table `threads` | Added or updated so the conversation appears in `codex resume` and the sidebar |
| The thread's name | `~/.codex/session_index.jsonl` | Added |
| Codex memory for that thread | `~/.codex/memories_1.sqlite`, table `stage1_outputs` | Added if this PC has none for that thread; paths rewritten |
| Goals of that thread | `~/.codex/goals_1.sqlite`, tables `thread_goals`, `thread_goal_continuation_deferrals` | Added if this PC has none for that thread |

Details that matter:

- **Codex must be closed** while ChatRelay writes. ChatRelay checks for running `codex` processes (CLI, VS Code extension, desktop app). It does not ask you to close anything during background sync; it just tries again later.
- **History mode is kept.** Newer Codex versions store "paginated" history; Codex rebuilds its page database (`thread_history_*.sqlite`) from the conversation file the first time you open it, so ChatRelay never writes that database.
- **Your own settings for a thread stay yours.** On update, this PC's pinned state, custom name, archive state and account are kept. Folders and sections that only exist on the other PC are cleared.
- **Account.** An imported thread is assigned to the Codex account that owns most threads on this PC.
- **Windows path prefix.** Codex on Windows stores working folders as `\\?\D:\project`. ChatRelay adds that prefix only to Windows paths on a PC whose Codex uses it, and never to macOS or Linux paths.
- **Compressed conversations** (`.jsonl.zst`) can be read and updated. On update the file is replaced by a plain `.jsonl` (the compressed original is backed up first).
- **Memory bookkeeping** that belongs to the other PC (how often a memory was used, whether it was picked for consolidation) is not copied.
- **Unknown versions.** If Codex's index uses a database ChatRelay doesn't know (for example a future `state_6.sqlite`), or adds a required field it can't fill, writing is turned off for Codex with a clear warning. Reading still works.
