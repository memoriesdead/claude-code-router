---
sidebar_position: 2
---

# Providers Configuration

Providers tell Claude Code Router where to send requests and how to authenticate.

The recommended setup in this fork is a single ChatGPT provider that uses Codex browser auth.

## Recommended ChatGPT Provider

```json
{
  "name": "chatgpt",
  "api_base_url": "https://chatgpt.com/backend-api/codex/responses",
  "auth_type": "browser",
  "models": ["gpt-5.4", "gpt-4o"],
  "transformer": {
    "use": ["openai-responses", "browser-auth"]
  }
}
```

## Why This Provider Works

- `api_base_url` points at the ChatGPT Codex responses backend
- `auth_type: "browser"` means the router uses the local Codex login token
- `openai-responses` converts Claude Code traffic to the responses format
- `browser-auth` reads Codex auth and adds the right headers

This path does not require an OpenAI API key.

## Provider Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique provider name used by routing |
| `api_base_url` | string | Yes | Provider endpoint |
| `auth_type` | string | No | Auth mode. Use `browser` for Codex subscription auth |
| `api_key` | string | No | API key for API-key-based providers |
| `models` | string[] | Yes | Models exposed by this provider |
| `transformer.use` | string[] | No | Transformers applied to this provider |

## Model Naming

Routing uses this format:

```text
provider,model
```

Example:

```text
chatgpt,gpt-5.4
```

## Browser Auth Notes

- run `codex login` before starting Claude Code through the router
- the router reads the local Codex auth file automatically
- if the logged-in account does not have access, model requests will fail even if the provider config is correct

## Related Pages

- [Routing Configuration](/docs/server/config/routing)
- [Transformers](/docs/server/config/transformers)
