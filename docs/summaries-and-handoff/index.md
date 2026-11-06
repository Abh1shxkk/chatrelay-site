# Summaries and handoff

Carry a project from one AI tool to the next.

> 🔒 **Secrets never reach the AI.** Before anything is sent to the model, ChatRelay replaces keys, tokens and passwords found in the chats (API keys for Anthropic, OpenAI, OpenRouter, GitHub, AWS, Google, Slack, Stripe, Hugging Face, npm, SendGrid, Telegram bots; JWTs; private keys; `PASSWORD=…`-style lines; passwords inside URLs) with `[REDACTED:kind]`. This always happens and can't be turned off; the screen shows how many were hidden. Your code and the rest of the conversation are still sent, so for private or client code prefer a paid model whose provider doesn't keep data.

Open **Summaries** (Advanced view), pick a project, tick the conversations (from any tool) and a model, then click **Generate handoff**.

- Models:
  - **Your logins, no API key:** "Claude Code · Sonnet / Opus" and "Codex" run through the Claude Code or Codex already installed and signed in on this PC, with your own plan. They appear only when that tool is installed. The summary runs in an empty temporary folder with no tools, and nothing is saved to that tool's history.
  - **Claude API** (Anthropic API key in **Settings → Secrets**): Claude Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.1.
  - **OpenRouter** (OpenRouter API key): an automatic free model, Nemotron 3 Ultra, Gemma 4 31B and MiniMax M3.1 Flash (free), DeepSeek V4 Flash (paid, very cheap). Any OpenRouter model works from the CLI with `--model openrouter:<id>`.
- Before anything is sent, ChatRelay shows what will be sent and to whom, which secrets it found and hid, and asks you to confirm.
- On top of the secret patterns, the values in the project's `.env` files and everything in your **Settings → Never send** list (client names, internal hosts, …) are hidden by exact match.
- The history is condensed first: your requests, the assistant's final answer of each turn, and the files changed. Long tool output and thinking are dropped. Conversations from all tools are merged in time order and labelled with their tool.
- Long histories are summarized in ~100k-token parts and then merged.
- The result has these sections: Project overview, What's done, Key decisions, Open bugs / known issues, Next steps, Files touched.

Then you can:

- **Save HANDOFF.md** in the project folder, or
- **Continue in…** a tool: choose Claude Code (`CLAUDE.md`), Codex (`AGENTS.md`) or Gemini CLI (`GEMINI.md`). The list shows the tools installed on this PC. ChatRelay adds a short "Previous context" section (overview, what's done, next steps) to that file. Running it again replaces only its own section; the rest of the file is untouched.
- Or **copy** the text.

From the command line: `chatrelay summarize --target handoff|claude-md|agents-md|gemini-md|none`.

## Continue a conversation in the other tool

Open a conversation and click **Continue in Claude Code** (on a Codex conversation) or **Continue in Codex** (on a Claude Code one). ChatRelay adds a new conversation to that tool in the same project, with every prompt and answer; tool calls and changed files appear as short notes, because the two tools record them differently. Then open the project and run `claude --resume` or `codex resume` (or pick it in the VS Code panel). The original conversation is not changed, and nothing is written while the target tool is running.

## Share a conversation

Open a conversation and click **Share**: copy it as Markdown, save a `.md` file, **Save as PDF** (the print dialog's "Save as PDF"), or **Create link**, a secret GitHub Gist that anyone with the link can read. Prompts and answers are included (tool calls if you tick it; thinking and tool output never), and keys, passwords, the project's `.env` values and your "never send" list are hidden first. A link needs a GitHub token with the `gist` scope: the GitHub CLI's login is used if you have one, or add one in **Settings → Secrets → GitHub gist token**.
