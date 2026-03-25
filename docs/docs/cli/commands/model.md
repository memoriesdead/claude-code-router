---
sidebar_position: 2
---

# ccr model

Interactive model selection and configuration.

## Usage

```bash
ccr model [command]
```

## Commands

### Select Model

Interactively select a model:

```bash
ccr model
```

This displays an interactive menu with all configured providers and models.

### Set Default Model

Set the default model directly:

```bash
ccr model set <provider>,<model>
```

Examples:

```bash
ccr model set gemini,gemini-3.1-pro
ccr model set chatgpt,gpt-5.4-turbo
ccr model set chatgpt,gpt-4o
```

### List Models

List all configured models:

```bash
ccr model list
```

### Add Model

Add a new model to configuration:

```bash
ccr model add <provider>,<model>
```

### Remove Model

Remove a model from configuration:

```bash
ccr model remove <provider>,<model>
```

## In-Session Model Switching

While using Claude Code via `ccr code`, you can switch models on-the-fly by typing `/model` followed by `provider,model`:

```
/model gemini,gemini-3.1-pro
/model chatgpt,gpt-5.4-turbo
/model chatgpt,gpt-4o
/model openrouter,anthropic/claude-opus-4-20250514
```

This bypasses all scenario routing and sends requests directly to the specified provider+model. The switch takes effect immediately for subsequent messages.

## Examples

### Interactive selection

```bash
$ ccr model

? Select a provider: gemini
? Select a model: gemini-3.1-pro

Default model set to: gemini,gemini-3.1-pro
```

### View current configuration

```bash
$ ccr model list

Configured Models:
  gemini,gemini-3.1-pro (default)
  gemini,gemini-2.5-pro
  gemini,gemini-2.5-flash
  chatgpt,gpt-5.4-turbo (think)
  chatgpt,gpt-4o
```

## Related Commands

- [ccr start](/docs/cli/commands/start) - Start the server
- [ccr status](/docs/cli/commands/status) - View service status
