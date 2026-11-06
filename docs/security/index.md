# Security

How your history stays safe.

- **Originals are never modified on upload.** Uploading only reads your history files.
- **Nothing is written while the tool is running** (Codex). Claude Code's open session (the one that triggered the hook) is never touched.
- **Backup before every write**, including Claude Code's `settings.json`, Codex's databases (with their `-wal` and `-shm` files) and `session_index.jsonl`.
- **Dry run for every import.** You see every file and every path rewrite before anything happens.
- **Both versions are kept on conflict**, never overwritten.
- **Secret scan.** Before uploading, ChatRelay looks for API keys and passwords: Anthropic, OpenAI, GitHub, AWS, Google, Slack and Stripe keys, JWTs, private keys, `.env`-style `SECRET=…` lines, and credentials inside URLs. You choose: **warn**, **redact** (replaced with `[REDACTED:kind]` in the uploaded copy only), or **off**.
- **Optional end-to-end encryption** (GitHub storage). In **Settings → Encryption** set a password: from then on every file is encrypted on your PC (Argon2id key, XChaCha20-Poly1305) before it is uploaded, so GitHub and anyone who gets into the repository see only scrambled data. Enter the same password on each PC, and in the web viewer's or phone's Settings. A PC without it can't read or upload anything. **If you forget the password, nobody can read the history**, not even ChatRelay. **Encrypt files stored before** re-uploads older files encrypted; then **Storage → Remove old versions** deletes the unencrypted copies from the repository's history.
- **Secrets stay in the OS keychain.** Your GitHub token and Anthropic key are never written to a file.
- **Your logins are never touched.** ChatRelay does not read, copy or change Claude Code's or Codex's login files (`~/.claude/.credentials.json`, `~/.codex/auth.json`, …). Syncing history cannot log you out. If you get logged out, it comes from the tool itself (for example an expired session or signing in with another account on another PC).
- **Private storage only.** Public GitHub repositories are refused.
- **No ChatRelay server.** Data only goes between your PCs, your folder or GitHub, and (only when you make a summary) the Anthropic API.

Not synced, by design: `~/.claude/history.jsonl` (your up-arrow prompt history across all projects), `~/.claude/file-history/` (rewind snapshots), and all credentials.
