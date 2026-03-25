---
sidebar_position: 3
---

# Quick Start

Get up and running with Claude Code Router in 5 minutes.

## 1. Install

```bash
npm install -g @musistudio/claude-code-router
```

Or run without installing:

```bash
npx @musistudio/claude-code-router start
```

## 2. Set Up Providers

### Gemini (free - default for everything)

1. Go to https://aistudio.google.com/apikey and create a free API key
2. Set it in your shell:

```bash
export GEMINI_API_KEY="your-gemini-key"
```

### ChatGPT (optional - uses your $20/mo Plus subscription)

1. Install OpenAI Codex CLI:
```bash
npm install -g @openai/codex
```

2. Sign in with your ChatGPT account:
```bash
codex login
```

3. A browser window opens - log in with your ChatGPT Plus account
4. Token is saved to `~/.codex/auth.json` automatically

No separate API key needed. The router reads your Codex OAuth token and uses your subscription credits.

## 3. Configure the Router

Edit `~/.claude-code-router/config.json`:

```json
{
  "Providers": [
    {
      "name": "gemini",
      "api_base_url": "https://generativelanguage.googleapis.com/v1beta/models/",
      "api_key": "$GEMINI_API_KEY",
      "models": ["gemini-3.1-pro", "gemini-2.5-pro", "gemini-2.5-flash"],
      "transformer": { "use": ["gemini"] }
    },
    {
      "name": "chatgpt",
      "api_base_url": "https://api.openai.com/v1/chat/completions",
      "auth_type": "browser",
      "models": ["gpt-5.4-turbo", "gpt-4o"],
      "transformer": { "use": ["browser-auth"] }
    }
  ],
  "Router": {
    "default": "gemini,gemini-3.1-pro",
    "think": "chatgpt,gpt-5.4-turbo",
    "background": "gemini,gemini-2.5-flash",
    "longContext": "gemini,gemini-2.5-pro",
    "longContextThreshold": 60000,
    "webSearch": "gemini,gemini-2.5-flash"
  }
}
```

Or use the Web UI:

```bash
ccr ui
```

## 4. Start the Router

```bash
ccr start
```

The router starts on `http://localhost:3456` by default.

## 5. Use Claude Code

```bash
ccr code
```

Your requests are routed through Claude Code Router to your configured providers.

## 6. Switch Models On-the-Fly

Type `/model provider,model` in Claude Code to switch models mid-conversation:

```
/model gemini,gemini-3.1-pro
/model chatgpt,gpt-5.4-turbo
/model chatgpt,gpt-4o
```

## Restart After Config Changes

```bash
ccr restart
```

## What's Next?

- [Basic Configuration](/docs/cli/config/basic) - Learn about configuration options
- [Routing](/docs/server/config/routing) - Configure smart routing rules
- [Model Switching](/docs/cli/commands/model) - All model commands
- [CLI Commands](/docs/category/cli-commands) - Explore all CLI commands
