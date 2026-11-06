# Search and usage

Find any prompt and see where your tokens go.

## Search every conversation

Open **Search** in the activity bar (**Ctrl+Shift+F**) and type a few words. ChatRelay finds every prompt you wrote and every answer the assistant gave that contains all of them, in every project and every tool, newest first and grouped by conversation, with the words highlighted. Click a match to open that conversation with the words already in its find box. Tool output (file contents, command output) is not searched. The first search reads your history once (under a second for about 2 GB); after that results are instant. From the command line: `chatrelay search <words>`.

## Usage

**Usage** in the activity bar shows, for the last 7, 30 or 90 days:

- Conversations, messages, tokens and active days, each compared with the period before, plus your current and longest streak.
- Activity per day, as conversations, messages or tokens, split by tool.
- When you work: a weekday × hour map.
- Tokens: how many the AI wrote, new input, and how many were read from or written to the cache, by model.
- Your projects and longest conversations; click one to open it.

**Copy report** copies it all as Markdown. Token counts come from Claude Code and Codex; Antigravity, Cursor and Kiro don't record them. It is worked out on this PC; nothing is sent.
