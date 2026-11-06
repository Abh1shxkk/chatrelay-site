# Known limitations

What ChatRelay does not do yet.

- The Windows installer is not code-signed (SmartScreen warning).
- Only Windows is tested. macOS and Linux build but have no published installers.
- A conversation open on two PCs at the same time can't be merged live; it becomes a conflict copy.
- Codex has no "session ended" hook, so a Codex conversation is uploaded about a minute after it goes quiet, not the moment it ends.
- For paths longer than 200 characters Claude Code's exact folder-name hash isn't documented; ChatRelay prefers an existing folder whose sessions record the same `cwd`, and otherwise uses its own `-<hash>` suffix.
- The web and phone viewers are read-only and need the GitHub backend.

## Roadmap

- Restoring Antigravity, Cursor and Kiro conversations into those tools.
- Code-signed installers; tested macOS and Linux builds.
