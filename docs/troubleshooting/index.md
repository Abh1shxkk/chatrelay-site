# Troubleshooting

Common problems and what to do.

**SmartScreen blocks the installer.** The installer isn't code-signed. Click **More info → Run anyway**.

**A project shows a yellow dot.** It has conversations on this PC that aren't uploaded yet. Push it, or turn on auto-sync.

**A project from my other PC doesn't appear / appears under a different name.** Projects are matched by git remote, a `.chatrelay.json`, or a link. If the folders have different names and no git remote, use **Link** (or **Import into…**) once and pick the right local folder.

**A Codex conversation was skipped: "Codex is running".** Close the Codex CLI, the VS Code extension's Codex panel (or VS Code) and the Codex desktop app, then pull again. Background sync retries by itself.

**Codex import is off: "Unknown Codex index database" / "new required fields".** Your Codex is newer than this ChatRelay version knows. Update ChatRelay. Your conversations are still visible.

**I see a conversation twice, one ending with "(from DESKTOP)".** It was continued on both PCs before they synced. Both versions are kept; delete the one you don't need in the tool.

**My old Claude Code conversations disappeared.** Claude Code deletes conversations older than `cleanupPeriodDays` (default 30). Raise it in Settings (or `chatrelay cleanup-days 3650`). Already-uploaded conversations can be pulled back from the backend.

**Did syncing log me out of Claude?** No. ChatRelay never reads or writes login files. See [Safety and privacy](#safety-and-privacy).

**Upload is slow the first time.** The first upload sends everything (compressed). After that only new lines are sent.

**"Pull first" when pushing.** Another PC uploaded a newer version that yours doesn't contain. Pull, then push.

**Offline.** Pushes are queued and retried automatically; `chatrelay queue` retries now.

**Something went wrong after a pull.** Open **Backups** and restore the backup made just before it.

**Where do I find errors?** The **Logs** view (copy an error report from there), or `~/.chatrelay/logs/chatrelay.log`.
