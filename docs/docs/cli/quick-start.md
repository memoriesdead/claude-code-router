---
sidebar_position: 3
---

# Quick Start

This is the fastest way to use Claude Code with ChatGPT 5.4 underneath.

## 1. Install the Required Tools

Install Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
```

Install Codex:

```bash
npm install -g @openai/codex
```

Install this fork:

```bash
npm install -g github:memoriesdead/claude-code-router
```

## 2. Log In With Codex

Use the ChatGPT account you want to route through:

```bash
codex login
```

This setup uses subscription auth from Codex, not an OpenAI API key.

## 3. Configure the Router

Edit `~/.claude-code-router/config.json`:

```json
{
  "LOG": true,
  "LOG_LEVEL": "info",
  "API_TIMEOUT_MS": 3000000,
  "Providers": [
    {
      "name": "chatgpt",
      "api_base_url": "https://chatgpt.com/backend-api/codex/responses",
      "auth_type": "browser",
      "models": ["gpt-5.4"],
      "transformer": {
        "use": ["openai-responses", "browser-auth"]
      }
    }
  ],
  "Router": {
    "default": "chatgpt,gpt-5.4",
    "background": "chatgpt,gpt-5.4",
    "think": "chatgpt,gpt-5.4",
    "longContext": "chatgpt,gpt-5.4",
    "longContextThreshold": 60000,
    "webSearch": "chatgpt,gpt-5.4"
  }
}
```

## 4. Start the Router

```bash
ccr start
```

## 5. Open Claude Code Through the Router

```bash
chat
```

You can also use:

```bash
ccr code
```

## What This Means

- Claude Code stays the UI and tool framework
- ChatGPT 5.4 is the routed model underneath
- `codex login` is the auth that matters

## After Config Changes

If you change `config.json`, restart the service:

```bash
ccr restart
```

Then close and reopen Claude Code with:

```bash
chat
```
