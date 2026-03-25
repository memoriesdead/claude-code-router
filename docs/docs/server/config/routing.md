---
sidebar_position: 3
---

# Routing Configuration

Configure how requests are routed to different models based on the task type.

## Routing Priority

The router evaluates requests in this order:

1. **Explicit model** - `/model provider,model` bypasses all routing
2. **Custom router** - JavaScript function via `CUSTOM_ROUTER_PATH`
3. **Project/session config** - Per-project overrides
4. **Long context** - Token count exceeds `longContextThreshold`
5. **Subagent model** - `<CCR-SUBAGENT-MODEL>` tag in system prompt
6. **Background** - Model name contains "claude" + "haiku"
7. **Web search** - Request includes `web_search` tools
8. **Think mode** - `req.body.thinking` is set (Plan Mode)
9. **Default** - Falls through to `Router.default`

## Default Routing

Set the default model for all requests:

```json
{
  "Router": {
    "default": "gemini,gemini-3.1-pro"
  }
}
```

## Built-in Scenarios

### Recommended Configuration

```json
{
  "Router": {
    "default": "gemini,gemini-3.1-pro",
    "background": "gemini,gemini-2.5-flash",
    "think": "chatgpt,gpt-5.4-turbo",
    "longContext": "gemini,gemini-2.5-pro",
    "longContextThreshold": 60000,
    "webSearch": "gemini,gemini-2.5-flash"
  }
}
```

This routes most tasks to Gemini (free) and thinking tasks to ChatGPT (via your Plus subscription).

### Background Tasks

Route lightweight tasks (title generation, summaries) to a fast, cheap model:

```json
{
  "Router": {
    "background": "gemini,gemini-2.5-flash"
  }
}
```

### Thinking Mode (Plan Mode)

Route thinking-intensive tasks to a model with extended thinking:

```json
{
  "Router": {
    "think": "chatgpt,gpt-5.4-turbo"
  }
}
```

### Long Context

Route requests exceeding the token threshold to a model with large context window:

```json
{
  "Router": {
    "longContextThreshold": 60000,
    "longContext": "gemini,gemini-2.5-pro"
  }
}
```

### Web Search

Route web search tasks:

```json
{
  "Router": {
    "webSearch": "gemini,gemini-2.5-flash"
  }
}
```

### Image Tasks

Route image-related tasks:

```json
{
  "Router": {
    "image": "gemini,gemini-2.5-pro"
  }
}
```

## Fallback Configuration

When a provider returns an error, the fallback chain tries alternatives:

```json
{
  "fallback": {
    "default": ["chatgpt,gpt-4o", "openrouter,anthropic/claude-sonnet-4-20250514"],
    "think": ["gemini,gemini-3.1-pro", "openrouter,anthropic/claude-opus-4-20250514"],
    "background": ["chatgpt,gpt-4o"]
  }
}
```

### How Fallback Works

1. Primary model request fails (HTTP error)
2. System checks fallback list for that scenario
3. Tries each backup model in order
4. Returns the first successful response
5. If all fail, returns the original error

### Configuration Details

- **Format**: `provider,model` - must match a configured provider
- **Per-scenario**: Each scenario can have its own fallback list
- **Optional**: Omit a scenario or use `[]` if no fallback needed

## Model Switching with /model

Users can switch models mid-conversation by typing `/model provider,model` in Claude Code:

```
/model gemini,gemini-3.1-pro      # Switch to Gemini 3.1
/model chatgpt,gpt-5.4-turbo     # Switch to GPT-5.4
/model chatgpt,gpt-4o            # Switch to GPT-4o
```

When `/model` is used, the router detects the comma in `req.body.model` and bypasses all scenario routing, sending directly to the specified provider+model.

## Project-Level Routing

Override routing per project in `~/.claude/projects/<project-id>/claude-code-router.json`:

```json
{
  "Router": {
    "default": "chatgpt,gpt-5.4-turbo"
  }
}
```

Project-level configuration takes precedence over global configuration.

## Custom Router

Create a custom JavaScript router function:

```javascript
// custom-router.js
module.exports = function(config, context) {
  const { scenario, projectId, tokenCount } = context;

  if (scenario === 'background') {
    return 'gemini,gemini-2.5-flash';
  }

  if (tokenCount > 100000) {
    return 'gemini,gemini-2.5-pro';
  }

  return 'gemini,gemini-3.1-pro';
};
```

Set `CUSTOM_ROUTER_PATH` environment variable to the path of your router file.

## Subagent Routing

Specify models for subagents using special tags in the prompt:

```
<CCR-SUBAGENT-MODEL>provider,model</CCR-SUBAGENT-MODEL>
Please help me analyze this code...
```

## Token Counting

The router uses `tiktoken` (cl100k_base) to estimate request token count for `longContext` routing decisions.

## Next Steps

- [Transformers](/docs/server/config/transformers) - Apply transformations to requests
- [Custom Router](/docs/server/advanced/custom-router) - Advanced custom routing
