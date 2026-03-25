---
sidebar_position: 3
---

# Routing Configuration

Routing decides which `provider,model` pair should handle each Claude Code scenario.

For this fork, the simplest and recommended setup is to route every scenario to ChatGPT 5.4.

## Recommended Routing

```json
{
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

## What These Routes Mean

- `default`: normal Claude Code requests
- `background`: background work
- `think`: higher-effort requests
- `longContext`: requests over the token threshold
- `webSearch`: web-search-related requests

If you want one model everywhere, point every route to the same value.

## Optional Fallback

If you want to keep a fallback model, add a fallback block:

```json
{
  "Router": {
    "default": "chatgpt,gpt-5.4"
  },
  "fallback": {
    "default": ["chatgpt,gpt-4o"]
  }
}
```

For the cleanest setup, leaving fallback arrays empty is fine.

## Project-Level Routing

You can override routing per project with:

```text
~/.claude/projects/<project-id>/claude-code-router.json
```

Example:

```json
{
  "Router": {
    "default": "chatgpt,gpt-5.4"
  }
}
```

## Routing Format

Each route must use:

```text
provider,model
```

Example:

```text
chatgpt,gpt-5.4
```
