# Sync between devices

Upload, download and keep everything in step.

## Push and pull

- **Push** uploads the conversations of a project that changed since the last sync. **Push all** does every project.
- **Pull** downloads what's new. It always starts with a **dry run** that lists every file it would write and every path rewrite. Nothing is written until you confirm.

## Auto-sync

When **Auto-sync** is on:

- **Claude Code**: hooks in `~/.claude/settings.json` run ChatRelay when a Claude Code session **starts** (pull) and **ends** (push).
- **Codex**: Codex has no such hook. The desktop app watches Codex's sessions and uploads a changed conversation about a minute after it goes quiet. Every 15 minutes (starting 20 seconds after launch) it also downloads new ones (skipped while Codex is running).
- Uploads that failed because you were offline are queued and retried.

You can turn auto-sync on or off in Settings, in the tray menu, or with `chatrelay hooks install|uninstall`.

## Status dots

| Dot | Meaning | What to do |
|---|---|---|
| Green | Synced | Nothing |
| Yellow / orange | Changes on this PC not uploaded yet | Push, or wait for auto-sync |
| Red | Last sync failed | Open **Logs** for the reason |
| Grey | Never synced | Push it once |
| Hollow circle | No project identity yet (not linked) | Push it (a link is created) or **Link** it to the project from the other PC |
| Crossed-out circle | Sync is off for this project on this PC | **Turn sync on** on the project's page, if you want it synced again |

## Keep a project on this PC only

Some projects should never leave a PC, for example client work that must stay on one machine. On the project's page click **Don't sync** (or hover a project in the Simple view and click **don't sync**). From then on nothing from that project is uploaded, and it is not downloaded automatically (auto-sync hooks, background sync, "Upload everything"). A manual **Pull** still works. The project shows a crossed-out status dot and "sync off on this PC"; **Turn sync on** undoes it. From the command line: `chatrelay exclude <dir>` (`--remove` to undo, no folder to list them).

## Backups

Every write is preceded by a backup in `~/.chatrelay/backups/<timestamp>-<what>/`. Open **Backups** (or `chatrelay backups`) to see them, and **Restore** one to put every file back exactly as it was. A restore also removes files that the change had created.

## Logs

**Logs** shows everything ChatRelay did, with errors highlighted, and a button that copies an error report.

## Tray menu

Push now · Pull now · Auto-sync on/off · Last sync status · Open · Quit.
