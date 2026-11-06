# Privacy

ChatRelay is an app that runs on your own devices. It has no server and no account, and it does not collect anything about you. This page says exactly where your data goes.

## What stays on your PC

- Your original chat history. ChatRelay only reads it when uploading.
- Your settings, sync state, backups and logs, in the `~/.chatrelay` folder.
- Your GitHub token and API keys, in the keychain of your operating system. They are never written to a file.
- Your usage report. It is worked out on your PC and nothing is sent.

ChatRelay never reads, copies or changes the login files of your AI tools.

## What leaves your PC

Data only moves when one of these happens:

| When | What goes | Where to |
|---|---|---|
| You sync | Compressed copies of your chats | The folder or private GitHub repository you chose |
| You make a summary | The condensed chat text, with secrets hidden first | The AI model you picked, after you confirm |
| You share a conversation with a link | That conversation, with secrets hidden first | A secret GitHub Gist |
| The app checks for updates | A normal web request | GitHub |

## Your choices

- **Secret scan.** Hide keys and passwords in what you upload: see [Security](#safety-and-privacy).
- **Encryption.** With a password, GitHub only ever stores scrambled data.
- **Don't sync.** Keep a project on one PC only: see [Keep a project on this PC only](#keep-a-project-on-this-pc-only).
- **Never send.** Words and values that are hidden from summaries and shared conversations.

## The web viewer

The web viewer keeps your token only in that browser, talks only to `api.github.com` and loads no third-party scripts.

## This website

The landing page and these docs load their fonts from Google Fonts. They use no analytics and no cookies. The docs remember your light or dark theme in your browser.

## Questions

Email [abhichauhan200504@gmail.com](mailto:abhichauhan200504@gmail.com).

