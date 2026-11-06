# Set up your second device

Bring your history to another PC.

On **PC 1** (the one that already has the history):

1. Install ChatRelay and choose a backend.
2. Upload: click **Upload now** in the Simple view (or **Upload everything** at the end of setup), or **Push** on a project in the Advanced view. A preview shows each conversation and any secrets found; you can choose to hide (redact) them in the uploaded copy.

On **PC 2**:

1. Install ChatRelay and choose **the same backend** (the same synced folder, or the same GitHub repo).
2. Put the project folder on PC 2 (for example with `git clone`). The path may differ, for example `D:\work\shop` instead of `C:\Users\me\shop`.
3. Click **Bring history to this PC** (Simple view), or open the **Sync** view (Advanced view). ChatRelay lists every project in the backend and where it would go on this PC:
   - **Git projects** are matched automatically by their remote URL.
   - **Other projects**: click **Import into…** / **Link** and pick the local folder once. The link is remembered.
4. Check the **dry run**: which files will be written and every path change (for example `×166  C:\Users\me\shop → D:\work\shop`). Then confirm.
5. Open the conversation in the tool: `claude --resume` or the VS Code Claude panel; `codex resume` or the Codex sidebar.

For Codex: **close Codex first** (CLI, VS Code extension and desktop app). ChatRelay never writes to Codex's files while it is running; that conversation is skipped with the reason "Codex is running", and comes in the next time.

Turn on **Auto-sync** on both PCs and you don't need to do any of this by hand again.
