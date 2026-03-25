# Provider Configuration

## Cost Strategy

- **Gemini**: Free API key from https://aistudio.google.com/apikey. No subscription needed.
- **ChatGPT**: Codex OAuth token from your ChatGPT Plus subscription ($20/mo). Run `codex login`, token saved to `~/.codex/auth.json`. The `browser-auth` transformer reads this and hits the standard OpenAI API.
- **Google subscriptions ($19.99/mo Pro, $42/mo Ultra) are web chat only - NO API access.**
- **OpenRouter**: Pay-per-token fallback. Only used if Gemini and ChatGPT both fail.

## Current Providers

### Gemini (Default) - FREE
- Models: `gemini-3.1-pro`, `gemini-2.5-pro`, `gemini-2.5-flash`
- Transformer: `gemini`
- Auth: Free API key via `x-goog-api-key` header
- Key: https://aistudio.google.com/apikey (no credit card needed)
- Notes: 1M+ token context, `gemini-3` models use `thinkingLevel` instead of `thinkingBudget`

### ChatGPT via Codex (Think Mode) - $20/mo subscription
- Models: `gpt-5.4-turbo`, `gpt-4o`
- Transformer: `browser-auth`
- Auth: OAuth token from `~/.codex/auth.json`
- Setup: `npm install -g @openai/codex && codex login`
- Uses standard OpenAI API endpoint with ChatGPT Plus OAuth token
- Draws from subscription credits, not separate API billing
- Config: `"auth_type": "browser"` skips API key requirement

### OpenRouter (Multi-provider Fallback)
- Models: `anthropic/claude-opus-4`, `anthropic/claude-sonnet-4`, etc.
- Transformer: `openrouter`
- Key: https://openrouter.ai/keys

## Provider Config Format

Standard provider (API key):
```json
{
  "name": "gemini",
  "api_base_url": "https://generativelanguage.googleapis.com/v1beta/models/",
  "api_key": "$GEMINI_API_KEY",
  "models": ["gemini-3.1-pro"],
  "transformer": { "use": ["gemini"] }
}
```

Codex OAuth provider (ChatGPT subscription):
```json
{
  "name": "chatgpt",
  "api_base_url": "https://api.openai.com/v1/chat/completions",
  "auth_type": "browser",
  "models": ["gpt-5.4-turbo", "gpt-4o"],
  "transformer": { "use": ["browser-auth"] }
}
```

## Key Files

- `packages/core/src/services/provider.ts` - Provider registration (passes authType/browserAuth)
- `packages/core/src/types/llm.ts` - LLMProvider, AuthType, BrowserAuthConfig types
- `packages/core/src/transformer/browser-auth.transformer.ts` - Reads Codex auth.json, injects OAuth token
