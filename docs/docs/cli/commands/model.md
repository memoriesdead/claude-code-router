---
sidebar_position: 2
---

# ccr model

Manage the router's active `provider,model` entries.

## Usage

```bash
ccr model [command]
```

## Common Commands

### Interactive Selection

```bash
ccr model
```

This opens an interactive picker based on the providers and models in `~/.claude-code-router/config.json`.

### Set the Default Model

```bash
ccr model set <provider>,<model>
```

Recommended example:

```bash
ccr model set chatgpt,gpt-5.4
```

### List Configured Models

```bash
ccr model list
```

### Add a Model

```bash
ccr model add <provider>,<model>
```

Example:

```bash
ccr model add chatgpt,gpt-4o
```

### Remove a Model

```bash
ccr model remove <provider>,<model>
```

## Example Output

```bash
$ ccr model list

Configured Models:
  chatgpt,gpt-5.4 (default)
  chatgpt,gpt-4o
```

## Notes

- changing the router model does not change Claude Code's branding in the UI
- the important value is the routed `provider,model`
- for this fork, the recommended default is `chatgpt,gpt-5.4`

## Related Pages

- [Quick Start](/docs/cli/quick-start)
- [Routing Configuration](/docs/server/config/routing)
