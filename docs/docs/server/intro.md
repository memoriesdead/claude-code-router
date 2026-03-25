---
title: Server Introduction
---

# Server Introduction

Claude Code Router Server is the local compatibility layer between Claude Code and the model provider you actually want to use.

For this fork, the documented path is:

- Claude Code stays the app and tool framework
- the router translates Claude Code traffic
- ChatGPT 5.4 handles the model response underneath

## What the Server Does

- receives Claude Code requests in Anthropic-style format
- applies routing rules
- runs transformers
- forwards the request to the configured provider
- returns the response back to Claude Code

## Simple Architecture

```text
Claude Code -> Claude Code Router -> ChatGPT Codex Responses Backend
```

## Core Pieces

- `Providers`: define where requests go and how they authenticate
- `Router`: decides which `provider,model` to use for each scenario
- `Transformers`: adapt request, response, and auth behavior
- `Logs`: record router activity and provider failures

## Recommended Server Setup

The recommended config for this fork uses:

- one provider: `chatgpt`
- one main model: `gpt-5.4`
- `auth_type: "browser"`
- transformers: `openai-responses` and `browser-auth`

## When to Restart

Restart the server after config changes:

```bash
ccr restart
```

## Related Pages

- [Providers Configuration](/docs/server/config/providers)
- [Routing Configuration](/docs/server/config/routing)
- [Transformers](/docs/server/config/transformers)
