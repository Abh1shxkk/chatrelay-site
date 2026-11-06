# Files it reads and writes

Exactly what ChatRelay touches on your PC.

| Where | What |
|---|---|
| `~/.chatrelay/config.json` | Machine name and ID, backend, links, options |
| `~/.chatrelay/state.json` | Per-session sync bookkeeping (hashes and sizes last pushed/pulled) |
| `~/.chatrelay/backups/` | Timestamped backups |
| `~/.chatrelay/logs/chatrelay.log` | JSON-lines log (Logs panel, copyable error report) |
| `~/.chatrelay/queue.json` | Pushes waiting for the backend |
| `~/.chatrelay/scan-cache.json` | Scan cache (sizes, times, titles) |
| OS keychain, service `chatrelay` | `github-token`, `anthropic-api-key` |
| `~/.claude/projects/…` | Claude Code conversations (read; written on pull) |
| `~/.claude/settings.json` | Only for auto-sync hooks and `cleanupPeriodDays` (backed up first) |
| `~/.codex/sessions/…`, `state_5.sqlite`, `session_index.jsonl`, `memories_1.sqlite`, `goals_1.sqlite` | Codex conversations and their index (read; written on pull, only while Codex is closed, backed up first) |
| `<project>/.chatrelay.json` | Only for non-git projects pushed from a project screen |
| `<project>/HANDOFF.md`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` | Only when you save a summary there |
