# Web and phone viewer

Read your chats on any device.

**🌐 Live web viewer:** <https://abh1shxkk.github.io/chatrelay-web/>

A read-only version of the app that opens the history in your **GitHub** backend from any browser or from the Android app: projects, conversations from every tool, and full transcripts. It uses the same Rust engine compiled to WebAssembly, so it shows exactly what the desktop app shows. Uploading, downloading, auto-sync and summaries stay in the desktop app, because they need the local history folders.

- Sign in with GitHub, or with your repo name and a **fine-grained token limited to that repo with Contents: Read-only**.
- The token is kept only in that browser (localStorage if you tick "remember", otherwise sessionStorage).
- The page only talks to `api.github.com` and loads no third-party scripts.
- The first visit reads each conversation once to count messages; results are cached by content hash.
- On phone-sized screens the layout switches to a single pane: list → project → transcript, with a back button and a bottom bar.
