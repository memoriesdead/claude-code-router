---
sidebar_position: 4
---

# Transformers

Transformers adapt Claude Code traffic to the provider you actually want to use underneath.

For the ChatGPT subscription path, the important transformers are `openai-responses` and `browser-auth`.

## Recommended Transformer Setup

```json
{
  "name": "chatgpt",
  "api_base_url": "https://chatgpt.com/backend-api/codex/responses",
  "auth_type": "browser",
  "models": ["gpt-5.4"],
  "transformer": {
    "use": ["openai-responses", "browser-auth"]
  }
}
```

## `openai-responses`

This transformer adapts Claude Code requests to the OpenAI responses-style format used by the ChatGPT Codex backend.

What it handles:

- converts Claude-style requests into the responses request shape
- carries over tools and streaming
- maps system instructions into the provider request
- keeps the routed model in sync with the provider call

## `browser-auth`

This transformer handles ChatGPT subscription auth through Codex.

What it handles:

- reads the local Codex auth file
- adds the `Authorization` header
- adds the extra ChatGPT backend headers required by the Codex responses endpoint

Use this when your provider config has:

```json
{
  "auth_type": "browser"
}
```

## Order

For the ChatGPT subscription path, use:

```json
{
  "transformer": {
    "use": ["openai-responses", "browser-auth"]
  }
}
```

## Notes

- `browser-auth` is for subscription auth, not API-key auth
- `openai-responses` is the bridge between Claude Code traffic and the ChatGPT responses backend
- if `codex login` is not valid for the account you want, transformers alone will not fix access problems
