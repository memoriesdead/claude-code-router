---
sidebar_position: 1
---

# Basic Configuration

Learn how to configure Claude Code Router to suit your needs.

## Configuration File Location

The configuration file is located at:

```
~/.claude-code-router/config.json
```

## Configuration Structure

### Providers

The recommended setup in this repo uses one ChatGPT provider with Codex browser auth:

```json
{
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
  ]
}
```

### Router

Configure which model to use by default:

```json
{
  "Router": {
    "default": "chatgpt,gpt-5.4"
  }
}
```

Format: `{provider-name},{model-name}`

### Transformers

For the ChatGPT subscription path, use:

```json
{
  "transformer": {
    "use": ["openai-responses", "browser-auth"]
  }
}
```

### Environment Variables

Use environment variables in your configuration:

```json
{
  "Providers": [
    {
      "name": "openai-api-key-provider",
      "api_base_url": "https://api.openai.com/v1/responses",
      "api_key": "$OPENAI_API_KEY",
      "models": ["gpt-4.1"]
    }
  ]
}
```

Both `$VAR_NAME` and `${VAR_NAME}` syntax are supported. For the documented ChatGPT subscription setup, use `auth_type: "browser"` instead of `api_key`.

## Complete Example

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
      "models": ["gpt-5.4", "gpt-4o"],
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

## Editing Configuration

Edit `~/.claude-code-router/config.json` directly or use `ccr ui`.

## Reloading Configuration

After editing the configuration, restart the router:

```bash
ccr restart
```

## Next Steps

- [Providers Configuration](/docs/server/config/providers) - Detailed provider configuration
- [Routing Configuration](/docs/server/config/routing) - Configure routing rules
- [Transformers](/docs/server/config/transformers) - Apply transformations
