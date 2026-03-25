# Claude Code Router - Custom Fork

Use Claude Code as the shell and tools, but route the actual model to ChatGPT 5.4 through Codex subscription auth.

This fork keeps the Claude Code terminal workflow and routes requests through a local compatibility layer. In simple words:

- Claude Code is still the app you use.
- ChatGPT 5.4 is the model underneath.
- `codex login` is the auth step that matters.

## What This Setup Does

- Keeps Claude Code commands, tools, and terminal workflow
- Routes Claude Code requests through `claude-code-router`
- Uses ChatGPT subscription auth from Codex instead of an OpenAI API key
- Makes `gpt-5.4` the default routed model

## Recommended Path

This fork is documented around one clean path first:

1. Install Claude Code
2. Install Codex and log in with the ChatGPT account you want to use
3. Install this router fork
4. Start the router and open Claude Code through it

## Install

Install Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
```

Install Codex:

```bash
npm install -g @openai/codex
```

Log in with the ChatGPT account you want to use:

```bash
codex login
```

Install this fork:

```bash
npm install -g github:memoriesdead/claude-code-router
```

## Configuration

Create `~/.claude-code-router/config.json`:

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
      "models": ["gpt-5.4"],
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
  },
  "fallback": {
    "default": [],
    "background": [],
    "think": [],
    "longContext": [],
    "webSearch": []
  }
}
```

### Why This Config

- `auth_type: "browser"` tells the router to use the Codex browser login token
- `browser-auth` reads the Codex auth file and adds the ChatGPT headers
- `openai-responses` adapts Claude Code traffic to the ChatGPT responses endpoint
- all routing scenarios point to `chatgpt,gpt-5.4`

You do not need an OpenAI API key for this setup.

## Start and Use

Start the router:

```bash
ccr start
```

Open Claude Code through the router:

```bash
chat
```

You can also use:

```bash
ccr code
```

Useful commands:

```bash
ccr status
ccr restart
ccr model
```

## What You Should Expect

- Claude Code still looks like Claude Code
- some UI text can still say `Claude`, `Opus`, or `Sonnet`
- the routed model underneath is `chatgpt,gpt-5.4`

Simple version:

- Claude Code shell
- ChatGPT 5.4 brain

## Troubleshooting

### `chat` says the model does not exist or you do not have access

Usually this means the Codex login is not usable for the account you want. Run:

```bash
codex login
```

Then fully close Claude Code and run:

```bash
chat
```

### `claude` asks you to log in

Use `chat`, not plain `claude`.

- `claude` opens Claude Code without the router
- `chat` opens Claude Code through the router

### The UI still says `Opus` or `Sonnet`

That is normal. Those are Claude Code UI labels. The routed backend can still be ChatGPT 5.4 underneath.

## Docs

- [CLI Introduction](docs/docs/cli/intro.md)
- [Quick Start](docs/docs/cli/quick-start.md)
- [Providers Configuration](docs/docs/server/config/providers.md)
- [Routing Configuration](docs/docs/server/config/routing.md)
- [Transformers](docs/docs/server/config/transformers.md)
- [ccr model](docs/docs/cli/commands/model.md)
