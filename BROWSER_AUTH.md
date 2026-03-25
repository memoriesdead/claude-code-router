# Browser-Based Authentication for Claude Code Router

## Overview

Browser-based authentication allows using subscription accounts (like ChatGPT Plus, Claude Pro via browser) instead of API keys. This is useful when:
- You have a subscription but no API access
- The provider doesn't offer API keys to your account tier
- You want to use your browser session directly

## How It Works

1. **No API Key Required**: Set `auth_type: "browser"` in provider config
2. **Cookie/Session Storage**: Browser sessions are stored in `~/.claude-code-router/sessions/`
3. **Automatic Cookie Management**: The `browser-auth` transformer handles:
   - Loading cookies from session files
   - Updating cookies after each request (from Set-Cookie headers)
   - 30-minute session cache

## Configuration

Add a browser-auth provider to your `~/.claude-code-router/config.json`:

```json
{
  "Providers": [
    {
      "name": "openai",
      "api_base_url": "https://chat.openai.com/v1/chat/completions",
      "auth_type": "browser",
      "models": ["gpt-5.4-turbo", "gpt-4o"],
      "transformer": {
        "use": ["browser-auth"]
      }
    }
  ],
  "Router": {
    "default": "openai,gpt-5.4-turbo"
  }
}
```

## Setting Up Browser Sessions

### Option 1: Export Cookies from Browser

1. Log in to the provider's website (e.g., chat.openai.com)
2. Open browser DevTools (F12)
3. Go to Application → Cookies
4. Export cookies as JSON format
5. Save to `~/.claude-code-router/sessions/openai.json`:

```json
{
  "cookies": "__Secure-next-auth.csrf-token=...; __Secure-next-auth.session-token=...",
  "csrfToken": "...",
  "lastUsed": 1711294800000
}
```

### Option 2: Use a Browser Extension

A browser extension can automatically export cookies to the session directory.

## Manual Session Files

Create session files manually for testing:

**OpenAI Session** (`~/.claude-code-router/sessions/openai.json`):
```json
{
  "cookies": "session_id=...; __cf_bm=...; __cf_clearance=...",
  "lastUsed": 1711294800000
}
```

**ChatGPT Session** (`~/.claude-code-router/sessions/chatgpt.json`):
```json
{
  "cookies": "session_id=...; chatgpt_session=...",
  "lastUsed": 1711294800000
}
```

## Routing

Use browser-auth providers in the router configuration:

```json
{
  "Router": {
    "default": "openai,gpt-5.4-turbo",        // Uses browser auth
    "background": "openai,gpt-4o-mini",       // Uses browser auth
    "think": "openai,gpt-5.4-turbo",         // Uses browser auth
    "longContext": "openai,gpt-5.4-turbo"    // Uses browser auth
    "webSearch": "openai,gpt-5.4-turbo"       // Uses browser auth
  }
}
```

## Session Cache

Browser sessions are cached in memory for 30 minutes to reduce file I/O. Sessions are automatically refreshed when:

- A request returns new Set-Cookie headers
- The cached session is older than 30 minutes

## Troubleshooting

### "No browser session found" Error

1. Check the session file exists: `~/.claude-code-router/sessions/{provider}.json`
2. Ensure cookies are in valid JSON format with a `cookies` field
3. Log in to the provider again to get fresh cookies

### Cookies Expired Quickly

Some providers have short-lived sessions. You may need to:

1. Use a browser extension to auto-refresh cookies
2. Manually update the session file frequently
3. Use OAuth if the provider supports it

## Security Notes

- Session files contain authentication cookies - treat them like passwords
- Don't commit session files to version control
- Set file permissions to restrict access: `chmod 600 ~/.claude-code-router/sessions/*`

## Advanced: CSRF Tokens

Some providers require CSRF tokens. Include in the session file:

```json
{
  "cookies": "...",
  "csrfToken": "your-csrf-token-here",
  "lastUsed": 1711294800000
}
```

The `browser-auth` transformer automatically includes CSRF tokens when present.

## Example: Full Config with Browser Auth

```json
{
  "LOG": true,
  "LOG_LEVEL": "info",
  "Providers": [
    {
      "name": "openai",
      "api_base_url": "https://chat.openai.com/v1/chat/completions",
      "auth_type": "browser",
      "models": ["gpt-5.4-turbo", "gpt-4o"],
      "transformer": {
        "use": ["browser-auth"]
      }
    },
    {
      "name": "anthropic",
      "api_base_url": "https://api.anthropic.com/v1/messages",
      "api_key": "$ANTHROPIC_API_KEY",
      "models": ["claude-opus-4-20250514", "claude-sonnet-4-20250514"],
      "transformer": {
        "use": ["anthropic"]
      }
    }
  ],
  "Router": {
    "default": "anthropic,claude-sonnet-4-20250514",
    "background": "anthropic,claude-haiku-4-20250514",
    "think": "anthropic,claude-opus-4-20250514",
    "longContext": "openai,gpt-5.4-turbo",
    "webSearch": "openai,gpt-4o"
  }
}
```
