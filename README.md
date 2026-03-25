# Claude Code Router - Custom Fork

A proxy that routes Claude Code requests to different LLM providers instead of Anthropic.

## 🚀 Quick Start

```bash
# 1. Install
npm install -g github:memoriesdead/claude-code-router

# 2. Start the router
ccr start

# 3. Use with Claude Code
export ANTHROPIC_BASE_URL="http://localhost:3456/v1"
export ANTHROPIC_AUTH_TOKEN="dummy"
claude
```

**For VS Code** - add to `.vscode/settings.json`:
```json
{
  "anthropic.baseUrl": "http://localhost:3456",
  "anthropic.apiKey": "dummy"
}
```

## ✨ Features

- **Model Routing**: Route requests to different models (default, background, think, long context, web search)
- **Gemini 3.1 Pro**: Free API with 1M+ token context, powerful reasoning
- **ChatGPT via Codex OAuth**: Use your ChatGPT Plus subscription ($20/mo) - no separate API billing
- **Dynamic Model Switching**: Switch models on-the-fly with `/model provider,model`
- **CLI Management**: `ccr start`, `ccr stop`, `ccr model`, `ccr ui`

## Cost Strategy

| Provider | Cost | Setup |
|----------|-------|-------|
| **Gemini 3.1 Pro** | FREE - Get key from https://aistudio.google.com/apikey |
| **ChatGPT Plus** | $20/mo subscription - `npm install -g @openai/codex && codex login` |
| **OpenRouter** | Pay-per-token fallback |

**Important**: Google subscriptions ($19.99/mo Pro, $42/mo Ultra) are web chat only - NO API access. Use the free API key.

## Configuration

Router config is at `~/.claude-code-router/config.json`:

```json
{
  "LOG": true,
  "LOG_LEVEL": "info",
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
    "background": "gemini,gemini-2.5-flash",
    "think": "chatgpt,gpt-5.4-turbo",
    "longContext": "gemini,gemini-2.5-pro",
    "webSearch": "gemini,gemini-2.5-flash"
  }
}
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `ccr start` | Start the router |
| `ccr stop` | Stop the router |
| `ccr restart` | Restart the router (apply config changes) |
| `ccr status` | Show router status |
| `ccr model` | Interactive model selection |
| `ccr ui` | Open web UI in browser |
| `ccr code "message"` | Run Claude Code through router |

## Model Switching

In Claude Code, use `/model` to switch models:

```
/model gemini,gemini-3.1-pro      # Free, fast
/model chatgpt,gpt-5.4-turbo       # Think mode, extended reasoning
/model chatgpt,gpt-4o              # ChatGPT 4o
```

## Environment Variables

```bash
export ANTHROPIC_BASE_URL="http://localhost:3456/v1"
export ANTHROPIC_AUTH_TOKEN="dummy"
```

Or use the built-in activate command:
```bash
eval "$(ccr activate)"
```

## Codex OAuth Setup (ChatGPT Plus)

```bash
npm install -g @openai/codex
codex login
```

The `browser-auth` transformer reads `~/.codex/auth.json` and injects the OAuth token as a Bearer header to the standard OpenAI API.

## GitHub Repository

https://github.com/memoriesdead/claude-code-router
