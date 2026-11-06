# First-time setup

What the setup wizard asks, step by step.

When ChatRelay opens for the first time, a setup wizard walks you through these steps. You can run it again any time from the command palette (**Ctrl+Shift+P → Run First-time Setup Again**).

1. **Your history.** ChatRelay finds Claude Code's history in `%USERPROFILE%\.claude\projects` (or the folder in `CLAUDE_CONFIG_DIR`) and Codex's in `%USERPROFILE%\.codex` (or `CODEX_HOME`). It also finds your Cursor, Kiro and Antigravity chats, and shows how many conversations it found per tool.
2. **Claude Code's 30-day deletion.** By default Claude Code deletes conversations older than 30 days (`cleanupPeriodDays`). ChatRelay shows this and offers to raise it. It backs up `settings.json` before changing it.
3. **Machine name.** For example `DESKTOP` or `LAPTOP`. It is shown next to every conversation, so you know which PC it came from.
4. **Storage (backend).** A folder (Google Drive, OneDrive, Dropbox, network drive) or a private GitHub repository. See the next section.
5. **Anthropic API key (optional).** Only needed for summaries. It is stored in the Windows Credential Manager (OS keychain), never in a file.
6. **Auto-sync.** Turns on automatic upload/download (Claude Code hooks plus the background timer).
7. **Upload everything.** Optionally uploads your whole existing history right away, with a progress bar.
