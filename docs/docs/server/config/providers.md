---
sidebar_position: 2
---

# Providers Configuration

Detailed guide for configuring LLM providers.

## Supported Providers

### Gemini (Recommended Default - FREE)

```json
{
  "name": "gemini",
  "api_base_url": "https://generativelanguage.googleapis.com/v1beta/models/",
  "api_key": "$GEMINI_API_KEY",
  "models": ["gemini-3.1-pro", "gemini-2.5-pro", "gemini-2.5-flash"],
  "transformer": { "use": ["gemini"] }
}
```

**Notes:**
- Free tier with generous limits, no credit card needed
- 1M+ token context window
- `gemini-3.x` models use `thinkingLevel` (low/medium/high) instead of token-based `thinkingBudget`
- Get your free key: https://aistudio.google.com/apikey

### ChatGPT via Codex OAuth (Uses Your Subscription)

```json
{
  "name": "chatgpt",
  "api_base_url": "https://api.openai.com/v1/chat/completions",
  "auth_type": "browser",
  "models": ["gpt-5.4-turbo", "gpt-4o"],
  "transformer": { "use": ["browser-auth"] }
}
```

**Notes:**
- No API key needed - uses your ChatGPT Plus/Pro subscription
- Setup: `npm install -g @openai/codex && codex login`
- Token saved to `~/.codex/auth.json`, read automatically by the `browser-auth` transformer
- Draws from your subscription credits, not separate API billing
- `gpt-5.4-turbo` supports extended thinking

### OpenAI API (Alternative - Separate Billing)

```json
{
  "name": "openai",
  "api_base_url": "https://api.openai.com/v1/chat/completions",
  "api_key": "$OPENAI_API_KEY",
  "models": ["gpt-5.4-turbo", "gpt-4o", "gpt-4o-mini"]
}
```

**Notes:**
- Requires a separate OpenAI API key (not included with ChatGPT Plus)
- No transformer needed (router already outputs OpenAI format)
- Get your key: https://platform.openai.com/api-keys

### OpenRouter (Multi-Provider Fallback)

```json
{
  "name": "openrouter",
  "api_base_url": "https://openrouter.ai/api/v1/chat/completions",
  "api_key": "$OPENROUTER_API_KEY",
  "models": [
    "anthropic/claude-opus-4-20250514",
    "anthropic/claude-sonnet-4-20250514",
    "google/gemini-2.5-pro-preview"
  ],
  "transformer": { "use": ["openrouter"] }
}
```

**Notes:**
- Access multiple providers through one API
- Pay-per-token, useful as a fallback
- Get your key: https://openrouter.ai/keys

### DeepSeek

```json
{
  "name": "deepseek",
  "api_base_url": "https://api.deepseek.com/v1/chat/completions",
  "api_key": "$DEEPSEEK_API_KEY",
  "models": ["deepseek-chat", "deepseek-reasoner"],
  "transformer": { "use": ["deepseek"] }
}
```

### Groq

```json
{
  "name": "groq",
  "api_base_url": "https://api.groq.com/openai/v1/chat/completions",
  "api_key": "$GROQ_API_KEY",
  "models": ["llama-3.3-70b-versatile"]
}
```

## Provider Configuration Options

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique provider identifier |
| `api_base_url` | string | Yes | API endpoint URL |
| `api_key` | string | Conditional | API key (supports `$ENV_VAR`). Not needed if `auth_type` is `"browser"` |
| `auth_type` | string | No | Set to `"browser"` for Codex OAuth auth (skips API key requirement) |
| `models` | string[] | Yes | List of available models |
| `transformer` | object | No | Transformer configuration |

## Authentication Methods

### API Key (default)
Set `api_key` to an environment variable reference. The router resolves `$VAR` and `${VAR}` syntax at startup.

### Codex OAuth (browser auth)
Set `auth_type: "browser"` and add `"browser-auth"` to your transformer chain. The `browser-auth` transformer reads `~/.codex/auth.json` (created by `codex login`) and injects the OAuth token as a Bearer header against the standard OpenAI API.

```bash
# One-time setup
npm install -g @openai/codex
codex login  # Opens browser, sign in with ChatGPT Plus
```

## Model Selection Format

When referencing a model in routing or `/model` commands, use:

```
provider,model
```

Examples:
```
gemini,gemini-3.1-pro
chatgpt,gpt-5.4-turbo
openrouter,anthropic/claude-opus-4-20250514
```

## Next Steps

- [Routing Configuration](/docs/server/config/routing) - Configure how requests are routed
- [Transformers](/docs/server/config/transformers) - Apply transformations to requests
