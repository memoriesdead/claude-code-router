# Routing System

## How Routing Works

The router (`packages/core/src/utils/router.ts`) runs as a Fastify preHandler on every `/v1/messages` request. It determines which provider+model handles each request.

## Priority Chain

1. **Explicit model** - If `req.body.model` contains a comma (`provider,model`), bypass all routing and use directly. This is how `/model` works.
2. **Custom router** - If `CUSTOM_ROUTER_PATH` is set, call the JS module first.
3. **Project/session config** - Check `~/.claude-code-router/{project}/{sessionId}.json` overrides.
4. **Long context** - Token count > `longContextThreshold` (default 60000) routes to `Router.longContext`.
5. **Subagent model** - `<CCR-SUBAGENT-MODEL>provider,model</CCR-SUBAGENT-MODEL>` tag in system prompt.
6. **Background** - Model name contains "claude" + "haiku" routes to `Router.background`.
7. **Web search** - Tools include `web_search*` routes to `Router.webSearch`.
8. **Think mode** - `req.body.thinking` set routes to `Router.think`.
9. **Default** - Falls through to `Router.default`.

## Fallback

If a provider returns an error, the fallback chain tries alternative models:
```json
{
  "fallback": {
    "default": ["openai,gpt-4o", "openrouter,anthropic/claude-sonnet-4"],
    "think": ["gemini,gemini-3.1-pro"]
  }
}
```

## Key Files

- `packages/core/src/utils/router.ts` - Routing logic
- `packages/core/src/server.ts` - preHandler hooks (router + model split)
- `packages/core/src/api/routes.ts` - Request handling, transformer chain
