import { readConfigFile } from ".";

/**
 * Get environment variables for Agent SDK/Claude Code integration
 * This function is shared between `ccr env` and `ccr code` commands
 */
export const createEnvVariables = async (): Promise<Record<string, string | undefined>> => {
  const config = await readConfigFile();
  const port = config.PORT || 3456;
  const apiKey = config.APIKEY || "test";

  return {
    ANTHROPIC_AUTH_TOKEN: apiKey,
    ANTHROPIC_BASE_URL: `http://127.0.0.1:${port}`,
    ANTHROPIC_DEFAULT_OPUS_MODEL: "chatgpt,gpt-5.4",
    ANTHROPIC_DEFAULT_SONNET_MODEL: "chatgpt,gpt-5.4",
    ANTHROPIC_DEFAULT_HAIKU_MODEL: "chatgpt,gpt-5.4",
    NO_PROXY: "127.0.0.1",
    DISABLE_TELEMETRY: "true",
    DISABLE_COST_WARNINGS: "true",
    API_TIMEOUT_MS: String(config.API_TIMEOUT_MS ?? 600000),
    CLAUDE_CODE_SUBAGENT_MODEL: "chatgpt,gpt-5.4",
    // Reset CLAUDE_CODE_USE_BEDROCK when running with ccr
    CLAUDE_CODE_USE_BEDROCK: undefined,
  };
}
