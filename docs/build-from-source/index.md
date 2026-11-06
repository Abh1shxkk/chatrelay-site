# Build from source

Run and test ChatRelay yourself.

Requirements: Node.js 20+, Rust (stable), and on Windows the MSVC toolchain (Visual Studio "Desktop development with C++").

```bash
git clone https://github.com/Abh1shxkk/chatrelay.git
cd chatrelay
npm install
npm run tauri:dev      # run the desktop app with hot reload
npm run test:rust      # cargo test --workspace: engine, adapters, push/pull, GitHub backend
npm test               # UI helper tests (vitest)
npm run typecheck      # TypeScript
npm run tauri:build    # installer in target/release/bundle/nsis/
```

Project layout:

```
crates/core/       Rust engine: scanner, JSONL, path rewriting, sync, backends, hooks, summaries
crates/core/src/providers/   AI tool adapters: claude_code.rs, codex.rs (+ codex_format.rs, browser-safe parsing)
crates/core/src/provider_sync.rs   other tools' sessions in push/pull (bundles, deltas, conflict copies)
crates/core/tests/  integration tests with fixture files (tests/fixtures/codex, tests/fixtures/claude-code)
crates/cli/        the `chatrelay` CLI (also what the Claude Code hooks run)
crates/wasm/       the engine compiled to WebAssembly for the web and phone viewers
src-tauri/         desktop app: window, tray, background sync, the API behind window.chatRelay
src/renderer/      React + TypeScript + Tailwind UI (shared by desktop, web and phone)
src/shared/        TypeScript types and helpers
mobile/            Android / iOS shell around the web version (Tauri)
scripts/           release, CLI staging, WASM build
tests/             vitest tests; tests/web/mock-github.mjs for testing the web version
```

Running a development copy next to an installed one: set a separate identifier and data folder, so it never touches your real settings:

```powershell
$env:TAURI_CONFIG='{"identifier":"com.chatrelay.dev","productName":"ChatRelay Dev"}'
$env:CHATRELAY_HOME='D:\tmp\chatrelay-dev'
npm run tauri:dev
```

## Web version

```bash
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli --version 0.2.129   # must match wasm-bindgen in Cargo.lock
npm run web:wasm     # rebuild the WebAssembly engine
npm run web:dev      # http://localhost:5175/web.html
npm run web:build    # static site in out/web/ (host on GitHub Pages, Cloudflare Pages, Netlify…)
```

`node tests/web/mock-github.mjs <folder-backend>` serves a folder backend as a fake GitHub API (dev builds only: set `localStorage['chatrelay-web:apiBase'] = 'http://localhost:5176'` and use the token `test-token-123456`).

## Mobile app (Android, iOS)

**Android** needs JDK 17, the Android SDK (platform 36, build-tools 36, NDK r27) and the Rust Android targets (`tauri android init` installs those):

```powershell
$env:JAVA_HOME = "<jdk-17>"; $env:ANDROID_HOME = "<android-sdk>"; $env:NDK_HOME = "$env:ANDROID_HOME\ndk\<version>"
npm run mobile:android:init      # once: generates mobile/gen/android
npm run mobile:android:apk       # debug APK for a phone (arm64)
adb install -r <that apk>
npm run mobile:android:release   # release APK/AAB, signed when CHATRELAY_KEYSTORE_PROPERTIES is set
```

Release signing reads a properties file kept **outside the repo**, named by `CHATRELAY_KEYSTORE_PROPERTIES`:

```properties
storeFile=D:/dev/android-keys/chatrelay-release.jks
storePassword=…
keyAlias=chatrelay
keyPassword=…
```

Create the key once with `keytool -genkeypair -keystore chatrelay-release.jks -alias chatrelay -keyalg RSA -keysize 4096 -validity 10000` and back it up: updates to an installed app must be signed with the same key.

**iOS** needs a Mac with Xcode and `rustup target add aarch64-apple-ios aarch64-apple-ios-sim`:

```bash
npm install && npm run web:wasm
npm run mobile:ios:init
npm run mobile:ios:dev
npm run mobile:ios:build
```
