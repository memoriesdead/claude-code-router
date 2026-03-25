---
title: CLI Introduction
---

# CLI Introduction

Claude Code Router CLI (`ccr`) manages the local router service that sits between Claude Code and the model provider underneath.

For this fork, the recommended use is:

- Claude Code as the shell and tools
- ChatGPT 5.4 as the routed model
- Codex browser auth as the login path

## Main Commands

```bash
ccr start
ccr status
ccr stop
ccr restart
ccr code
chat
ccr model
ccr ui
```

## Recommended Workflow

1. Run `codex login`
2. Start the router with `ccr start`
3. Open Claude Code through the router with `chat`

## What Each Command Does

- `ccr start`: starts the local router service
- `ccr status`: shows whether the service is running
- `ccr restart`: restarts the service after config changes
- `ccr code`: opens Claude Code through the router
- `chat`: shortcut launcher for the same routed Claude Code flow
- `ccr model`: manages the configured `provider,model` values
- `ccr ui`: opens the router web UI

## Important Note

Use `chat` or `ccr code` for the routed setup.

If you run plain `claude`, you are bypassing the router.

## Related Pages

- [Quick Start](/docs/cli/quick-start)
- [ccr model](/docs/cli/commands/model)
