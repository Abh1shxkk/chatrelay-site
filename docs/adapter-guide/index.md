# Adapter guide

Add another AI tool.

1. **Verify the storage format on a real machine first**: where sessions live, the line/record format, any index database and its schema, how the tool lists sessions, how it stores paths, which processes mean "running". Write it down at the top of the adapter file.
2. Add a `ProviderId` in `crates/core/src/providers/mod.rs` and a file `providers/<tool>.rs` implementing `ProviderAdapter`: `detect`, `list_projects`, `list_sessions`, `read_session`, `export_session`, `import_session`, optionally `append_session`, `context_file_name`, `process_names`.
3. Rules every adapter follows: refuse to write while the tool runs (`ensure_not_running`), back up every file before writing (`ImportOptions.backups`), honour `dry_run`, honour `keep_both` (save a diverged incoming session under a new id), and turn import off (with a warning in `ProviderStatus`) on any format it doesn't recognise.
4. Put pure parsing in a file without file-system access (like `codex_format.rs`) so the web viewer can use it, and add it to `messages_from_bundle`.
5. Add fixture files under `crates/core/tests/fixtures/<tool>/` and tests: detect, list, read, export → import on a second fake machine (paths rewritten), update, local-ahead, conflict, running-process refusal, unknown format.
6. Add the label in `src/shared/types.ts` (`PROVIDER_LABELS`). Badges, filters, push/pull, summaries and the viewer pick it up from there.
