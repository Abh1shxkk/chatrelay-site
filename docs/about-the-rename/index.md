# About the rename

From Claude Sync to ChatRelay.

ChatRelay was called **Claude Sync** until v0.5.0. Since then every name has changed too: the app and its install folder (`%LOCALAPPDATA%\ChatRelay`), the `chatrelay` command, the `~/.chatrelay` data folder, the `CHATRELAY_*` environment variables, `.chatrelay.json` project files, the keychain service `chatrelay` and the releases repository [chatrelay-releases](https://github.com/Abh1shxkk/chatrelay-releases).

Moving over from Claude Sync, once per PC:

1. Quit Claude Sync (tray → **Quit**) and uninstall it in Windows **Settings → Apps**.
2. Rename the folder `~/.claude-sync` to `~/.chatrelay`. Your settings, sync state and backups come with it.
3. Install ChatRelay, then turn **Auto-sync** on. This replaces the old Claude Sync hooks in `~/.claude/settings.json`.
4. Add your GitHub token and API keys again (**Settings → Secrets**, or sign in with GitHub). They were saved in the keychain under the old name.
5. Rename any `.claude-sync.json` in your project folders to `.chatrelay.json`.
6. On Android, uninstall the old app before installing the new APK.

Your history in GitHub or the sync folder does not change; nothing needs to be uploaded again.
