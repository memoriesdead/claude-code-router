# Claude Code Router - Test Prompt

**Copy this entire prompt into another Claude Code session.**

---

## Quick Health Check

```bash
curl http://localhost:3456/health
```

If it returns `{"status":"ok"}`, the router is running.

## Model Check

```bash
curl http://localhost:3456/providers | jq -r '.[] | .name'
```

Tell me which provider name appears in the JSON response. It should be either `"chatgpt"` or `"gemini"`.

## Model Switching Test

Then test each of these:

```bash
curl http://localhost:3456/messages -X POST -H "Content-Type: application/json" -d '{"model":"gemini,gemini-3.1-pro"}'
```

```bash
curl http://localhost:3456/messages -X POST -H "Content-Type: application/json" -d '{"model":"chatgpt,gpt-5.4-turbo"}'
```

```bash
curl http://localhost:3456/messages -X POST -H "Content-Type: application/json" -d '{"model":"chatgpt,gpt-4o"}'
```

Tell me:
1. Did the model indicator in Claude Code change after each request?
2. What provider name appears in the response headers or body?

---

**Note:** You don't need to sign in or authenticate - just send the requests. The router uses your configured API keys or Codex OAuth token automatically.
