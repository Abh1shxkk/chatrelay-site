# Changelog

What changed in each release.

## v0.6.3

2026-11-06

#### Small fixes

- **Settings → AI tools** now shows the installed version of Cursor, Kiro and Antigravity.
- The web viewer and phone app show the real title and start time of Cursor, Kiro and Antigravity chats.
- The app no longer speaks of Claude Code and Codex only.

## v0.6.2

2026-11-06

#### Cursor CLI and Kiro CLI

ChatRelay now finds your chats from the **Cursor CLI** and the **Kiro CLI**, next to the Cursor and Kiro editors. You can open them, search them, summarize them and sync them to your other devices. Like the editor chats, they are read-only: they are not restored into Cursor or Kiro on another PC.

## v0.6.1

2026-11-06

#### Fix: Install the GitHub App link

The ChatRelay GitHub App has a new name, so the **Install** link in the sign-in step of 0.6.0 no longer opened. This version points at the new address. Nothing else changes.

## v0.6.0

2026-11-06

#### Usage report

**Usage** in the activity bar shows the last 7, 30 or 90 days:

- Conversations, messages, tokens and active days, each compared with the period before, plus your current and longest streak.
- Activity per day as conversations, messages or tokens, with a colour per tool.
- When you work: a weekday × hour map.
- Tokens the AI wrote, new input, and what was read from or written to the cache, with a table per model.
- Your projects and your longest conversations; click one to open it.

**Copy report** copies everything as Markdown. From the command line: `chatrelay usage --days 90`. It is worked out on your PC; nothing is sent. Antigravity, Cursor and Kiro don't record tokens, so they show "–".

## v0.5.9

2026-11-05

#### Antigravity, Cursor and Kiro chats

ChatRelay now finds your conversations from three more tools, next to Claude Code and Codex:

- **Antigravity**: the editor's agent chat and the Antigravity CLI.
- **Cursor**: the editor's agent chat.
- **Kiro**: the editor's agent chat.

Their conversations show up under your projects. You can read them, search them, summarize them, share them and continue them in Claude Code. They also sync to your other PCs, your phone and the web viewer.

They are read-only: ChatRelay doesn't put them back into Antigravity, Cursor or Kiro on another PC. Those tools keep their history in their own private formats, and writing into them could break it.

Gemini CLI isn't supported. Google no longer lets personal accounts sign in to it and moves them to Antigravity instead.

## v0.5.8

2026-11-05

#### Simple view fits the window

- No more scrolling the whole page: the status, the sync buttons and the bottom bar stay in place, and only the list of projects scrolls.
- The status is one line, with the number of projects, conversations and projects to upload next to the title.
- Upload now, Bring history here and Sync automatically sit side by side.
- Help (continuing a conversation, what the dots mean) opens from the bottom bar.

## v0.5.7

2026-11-05

#### New

- **Continue a conversation in the other tool.** Open a conversation and click **Continue in Claude Code** (on a Codex chat) or **Continue in Codex** (on a Claude Code chat). A new conversation with the whole history is added to that tool in the same project; open it with `claude --resume` or `codex resume`. The original is not changed.
- **Share a conversation.** Click **Share** on a conversation: copy it as Markdown, save a `.md`, save as PDF, or create a secret GitHub Gist link. Keys, passwords, `.env` values and your "never send" list are hidden first.
- **End-to-end encryption (optional).** Settings → **Encryption**: set a password and your history is encrypted on your PC before it reaches GitHub. Enter the same password on every PC, the phone and the web viewer. If you forget it, nobody can read the history.
- **Usage.** A new **Usage** page: conversations per day, busiest projects and tools, for 7, 30 or 90 days.
- **Storage.** Settings → **Storage** shows how much your GitHub repository uses and can remove old versions (every current conversation is kept).
- **Never send.** Settings → **Never send**: words and values that are always hidden from summaries and shared chats, on top of secrets and the project's `.env` values.
- **Codex uploads sooner:** about a minute after a chat goes quiet, instead of every 15 minutes.

#### Other

- Command line: `chatrelay storage [--compact]`.

## v0.5.6

2026-11-05

#### Faster and more reliable sync

- **Fixed: one project could freeze every other sync for 10 minutes.** Downloading a conversation that contained a project path followed by a long run of data (for example a pasted image) crashed the sync. That project never downloaded, and every other upload or download waited and failed. Such conversations now download normally.
- **Faster with GitHub.** Listing your stored projects is about 5x faster (25 s → 5 s on a 45-project history) and nearly instant after the first time. Uploads and downloads send and fetch several files at once.
- **Fewer failed downloads.** When GitHub cuts a large download short, it is retried.

#### Simple view

- Organized into sections: Sync, Projects on this PC and Help.
- Filter projects by status (to upload, not uploaded, backed up, sync off), search them, and see when each was last used. Projects that need uploading are listed first.

#### Other

- Update notes are shown as formatted text.
- Command line: `push --all --dry-run` and `pull --all --dry-run` now only report and change nothing.

## v0.5.5

2026-11-04

#### New

- **Search every conversation.** Open **Search** in the activity bar (**Ctrl+Shift+F**) and type a few words. ChatRelay finds every prompt and answer that contains all of them, in every project and every tool (Claude Code and Codex), newest first, with the words highlighted. Click a match to open that conversation. CLI: `chatrelay search <words>`.
- **Keep a project on this PC only.** Click **Don't sync** on a project's page (or in the Simple view). Nothing from it is uploaded, and it is not downloaded automatically. **Turn sync on** undoes it. CLI: `chatrelay exclude <dir>`.
- **Summaries with no API key.** Pick "Claude Code · Sonnet / Opus (your login)" or "Codex (your ChatGPT login)" to write summaries through the Claude Code or Codex already signed in on this PC. Nothing is saved to that tool's history.

#### Fixed

- Opening a conversation could show some messages twice.
- Remote projects now show their name, not only an ID.

## v0.5.4

2026-10-23

New 'Developed by' footer with GitHub, X, LinkedIn, website and email links. Updates now show up within minutes when you come back to the app window.

## v0.5.3

2026-10-23

Before a summary is made, ChatRelay now shows what will be sent and to whom, hides keys, tokens and passwords it finds, and asks you to confirm (with a clear warning that detection can miss things). More secret types are recognised (OpenRouter, Telegram bots, Hugging Face, npm, SendGrid). The app checks for updates every hour and when you come back to it. Developer credits in Settings > About.

## v0.5.2

2026-10-22

Summaries can now use OpenRouter, including free models (no Anthropic key needed): add an OpenRouter key in Settings, then pick a model under OpenRouter in Summaries. Chat titles no longer show Claude in Chrome's instructions. Small layout fixes.

## v0.5.1

2026-10-20

### What's new in 0.5.1

## v0.5.0

2026-10-20

Codex: only new lines are uploaded/downloaded; when both PCs changed a chat both versions are kept; Codex memories and goals travel with the chat; summaries include Codex chats and can be added to AGENTS.md / GEMINI.md; Codex projects upload automatically with auto-sync; Codex chats in the web/phone viewer.

## v0.4.0

2026-10-20

Small fixes.

## v0.3.4

2026-10-20

The app now checks for updates every time you open it — including when you open it from the tray — and shows the update popup again even if you chose Later before.

## v0.3.3

2026-10-20

Check for updates now shows what it is doing (a spinner while checking, then 'Up to date' or 'Update to …'), in the simple view, the advanced view's status bar, Settings → About and the command palette.

## v0.3.2

2026-10-20

Small fixes.

## v0.3.0

2026-10-19

First version with automatic updates. From now on the app tells you when a new version is out and updates itself with one click.
