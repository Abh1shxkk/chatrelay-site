# Install

Get ChatRelay on your devices.

## Windows

1. Download `ChatRelay_<version>_x64-setup.exe` from the [latest release](https://github.com/Abh1shxkk/chatrelay-releases/releases/latest).
2. Run it. The installer is not code-signed, so Windows SmartScreen may say "Windows protected your PC": click **More info → Run anyway**.
3. You only install once. Later versions arrive by themselves (see [Updates](#updates)).

The app installs per user in `%LOCALAPPDATA%\ChatRelay\`. It starts in the system tray. Closing the window keeps it running there; use **Quit** in the tray menu to stop it.

## Android (viewer)

Download `ChatRelay_<version>.apk` from the same release page and open it on your phone (allow "install unknown apps" for your browser or file manager when asked). The Android app is a **read-only viewer** of your GitHub storage; a phone has no AI tool history of its own.

## macOS and Linux

A GitHub Actions workflow (`.github/workflows/desktop-mac-linux.yml`) builds a macOS (Apple silicon) `.dmg` and a Linux `.AppImage` and `.deb`, and can add them, with their update entries, to a release. They are not code-signed (macOS: right-click → **Open** the first time) and have had little testing.

## Web

The web viewer is a static page you can host yourself (GitHub Pages, Cloudflare Pages, Netlify…) or run locally. See [Web and phone viewer](#web-and-phone-viewer).
