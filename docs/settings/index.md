# Settings

Every setting and what it does.

| Section | Setting | Meaning |
|---|---|---|
| This machine | Machine name | Shown next to everything this PC uploads |
| Sync backend | Folder / GitHub | Where history is stored; **Test** checks the connection |
| AI tools | (status) | Each tool: installed or not, version, format detected, restore on/off, warnings, number of conversations, context file |
| Automatic sync | Auto-sync | Claude Code hooks, Codex upload a minute after a chat goes quiet, 15-minute background sync |
| Automatic sync | Transcript retention (cleanupPeriodDays) | How long Claude Code keeps conversations before deleting them |
| What to sync | Subagent transcripts (sidecars) | Claude Code's per-session `subagents/` and `tool-results/` folders |
| What to sync | Project memory | Claude Code's per-project memory folder (`memory/`) |
| What to sync | Secret scan before upload | Off / Warn / Auto-redact |
| What to sync | Versions kept (folder backend) | Previous copies of each file kept by the folder backend |
| Encryption (GitHub) | Password | Turns on end-to-end encryption, or unlocks an encrypted history on this PC; **Encrypt files stored before** |
| Storage (GitHub) | Remove old versions | Shows the repository's size and deletes old versions from its history (every current conversation is kept) |
| Secrets | GitHub token, Anthropic API key, OpenRouter API key, GitHub gist token | Stored in the OS keychain (**Remove from keychain** deletes one) |
| Summaries | Default model | Model used for summaries |
| Never send | List | Words and values hidden from summaries and shared conversations, on top of secrets and `.env` values |
| Appearance | Theme | Dark / light |
| About | Version, Check for updates | |

The same settings from the command line: `chatrelay config [key] [value]`, for example `config machineName DESK-1`, `config backend.folder "G:\My Drive\chatrelay"`, `config backend.github me/my-history`, `config secretScan redact`.
