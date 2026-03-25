# Claude Code Router - Test Instructions

Share this with your friend to test that the router is working.

## Quick Test (5 seconds)

Run this command in a separate terminal:

```bash
curl http://localhost:3456/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-24T..."
}
```

## Model Switch Test (10 seconds)

Test 1: Run this to see Gemini 3.1 Pro
```bash
curl http://localhost:3456/providers | jq -r '.[] | .name' 1
```

Expected response should include:
- `"chatgpt"` or `"gemini"` - which provider is routing the request

Then tell me: **What provider is it using?**

Test 2: Run this to switch models
```
/model gemini,gemini-3.1-pro
/model chatgpt,gpt-5.4-turbo
/model chatgpt,gpt-4o
```

Each time you run `/model`, tell me:
- Did you see "Set model to..." output in terminal?
- Did the response provider change?

## Extended Thinking Test

Run a planning task (asks for code):
```
Plan a 3-step function to solve this problem.
```

Then tell me:
- Which model responded? (Gemini = fast, ChatGPT = extended thinking)
- Was thinking shown in the response?
- Were the responses good?

---

**IMPORTANT:** The router's `ccr statusline` command is currently broken (esbuild cache issue). To see the model in your **Claude Code UI status bar**, use the web UI at http://localhost:3456/ui/ instead.

**Current model routing (check `~/.claude-code-router/config.json`):**
- Default: `gemini,gemini-3.1-pro`
- Think: `chatgpt,gpt-5.4-turbo` (uses your ChatGPT Plus via Codex OAuth)

---

**What should work:**

- ✅ `curl http://localhost:3456/health` returns `{"status":"ok"}`
- `/model` switches work (you'll see console output when using `ccr code`)
- Provider switching works (router respects `provider,model` format)
