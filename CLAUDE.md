# Claude Code Router - Custom Fork

A proxy that routes Claude Code requests to different LLM providers instead of Anthropic.

## Cost Strategy

- **Gemini** (default) - Free API key from Google AI Studio. No subscription needed.
- **ChatGPT** (think mode) - Uses Codex OAuth token from your ChatGPT Plus subscription ($20/mo). No separate API key.
- **How it works**: Install OpenAI Codex CLI, run `codex login`, sign in with ChatGPT. The browser-auth transformer reads `~/.codex/auth.json` and injects the OAuth token against the standard OpenAI API.
- **Google subscriptions ($19.99/mo Pro, $42/mo Ultra) are web chat only - NO API access.** Use the free API key.
- **OpenRouter**: Pay-per-token fallback if both Gemini and ChatGPT fail.

## Quick Reference

```bash
pnpm build            # Build all packages
ccr start             # Start the router
ccr code              # Launch Claude Code through router
ccr restart           # Apply config changes
ccr model             # Switch models interactively
ccr ui                # Web management UI
```

## Setup (one-time)

```bash
# 1. Gemini (free)
#    Get key from https://aistudio.google.com/apikey
export GEMINI_API_KEY="your-key"

# 2. ChatGPT (uses your Plus subscription)
npm install -g @openai/codex
codex login            # Sign in with ChatGPT in browser
#    Token saved to ~/.codex/auth.json - that's it

# 3. Start
ccr start && ccr code
```

## Architecture

```
packages/
  core/    @musistudio/llms   - Transformers, routing, SSE streams
  server/  @CCR/server        - Fastify API server
  shared/  @CCR/shared        - Constants, presets, utilities
  cli/     @CCR/cli           - `ccr` CLI commands
  ui/      @CCR/ui            - React web UI
```

## Request Pipeline

```
Claude Code -> POST /v1/messages (Anthropic format)
  -> AnthropicTransformer.transformRequestOut() -> unified format
  -> Router selects provider (default/background/think/longContext/webSearch)
  -> Provider transformer.transformRequestIn() -> provider format
  -> HTTP to provider API
  -> Provider transformer.transformResponseOut() -> unified format
  -> AnthropicTransformer.transformResponseIn() -> Anthropic SSE
  -> back to Claude Code
```

## Auth Methods

| Provider | Auth | Cost | Setup |
|----------|------|------|-------|
| Gemini | Free API key | $0 | Get key from aistudio.google.com/apikey |
| ChatGPT | Codex OAuth token | $20/mo (existing sub) | `codex login` |
| OpenRouter | API key | Pay per token | openrouter.ai/keys |

## Model Switching

Use `/model provider,model` in Claude Code to switch mid-conversation:
```
/model gemini,gemini-3.1-pro
/model chatgpt,gpt-5.4-turbo
/model chatgpt,gpt-4o
```

## Current Defaults

| Scenario    | Provider,Model          | Why |
|-------------|-------------------------|-----|
| Default     | gemini,gemini-3.1-pro   | Free, 1M+ context, strong reasoning |
| Background  | gemini,gemini-2.5-flash | Free, fast |
| Think       | chatgpt,gpt-5.4-turbo  | Extended thinking via ChatGPT Plus |
| Long Context| gemini,gemini-2.5-pro   | Free, 1M+ context |
| Web Search  | gemini,gemini-2.5-flash | Free, fast |

## Development Notes

- Node.js >= 20, pnpm >= 8
- TypeScript throughout (UI is ESM)
- Build: esbuild (core/server/cli), Vite (ui)
- Config: `~/.claude-code-router/config.json` (JSON5, env var interpolation)
