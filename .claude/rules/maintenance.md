# Maintenance

## Upstream Sync

```bash
git remote add upstream https://github.com/musistudio/claude-code-router.git
git fetch upstream && git merge upstream/main --no-edit
```

Resolve conflicts prioritizing our files:
- `.claude/` directory
- `packages/core/src/transformer/browser-auth.transformer.ts`
- `packages/core/src/types/llm.ts` (AuthType additions)
- `packages/core/src/services/provider.ts` (browser auth skip)
- `packages/core/src/api/routes.ts` (browser auth headers)

## 24/7 Operation

```bash
# PM2 (recommended)
pm2 start "ccr start" --name ccr --restart-delay 3000
pm2 save && pm2 startup

# Health check
curl http://127.0.0.1:3456/health
```

## Config Changes

Edit `~/.claude-code-router/config.json` then `ccr restart`.
Config supports JSON5 (comments) and env var interpolation (`$VAR` or `${VAR}`).
Automatic backups kept (last 3).

## Logs

- Server logs: `~/.claude-code-router/logs/ccr-*.log`
- App log: `~/.claude-code-router/claude-code-router.log`
