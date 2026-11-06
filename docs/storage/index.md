# Choose your storage

Your history goes to a place you control.

Your history goes to a place **you** control. ChatRelay has no server of its own.

## Option A: a folder

Any folder that your other PCs can also see:

- Google Drive for desktop, e.g. `G:\My Drive\chatrelay`
- OneDrive, e.g. `%OneDrive%\chatrelay`
- Dropbox, a NAS or network share, or a USB drive you carry

Only compressed copies go there. Your live `~/.claude` and `~/.codex` folders are never moved into a cloud folder. The folder backend also keeps the previous versions of each file (**Settings → What to sync → Versions kept (folder backend)**, default 2).

## Option B: a private GitHub repository

Best if you also want the web or phone viewer.

1. **Sign in with GitHub** (recommended). ChatRelay shows a short code; you enter it on github.com and approve. The ChatRelay GitHub App only gets access to the repositories you choose (normally just your history repository), with permission to read and write their contents. No password is stored, and no server is involved.
2. Or paste a **personal access token** (classic token with `repo` scope, or a fine-grained token with *Contents: Read and write* on that one repo). If you are logged in with the GitHub CLI (`gh auth login`), ChatRelay can use that token.
3. Pick an existing **private** repository or click **Create private repo**. Public repositories are refused, because chat history can contain private code and secrets.

On GitHub, each upload is **one commit**. Files bigger than 40 MB (compressed) are split into parts automatically, because GitHub refuses single files over 100 MB.

The token lives only in the OS keychain (service `chatrelay`).
