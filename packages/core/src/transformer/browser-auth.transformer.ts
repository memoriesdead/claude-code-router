import { promises } from "fs";
import { join } from "path";
import { homedir } from "os";
import { Transformer, TransformerContext } from "@/types/transformer";
import { LLMProvider, UnifiedChatRequest } from "@/types/llm";

/**
 * Codex auth.json format (from ~/.codex/auth.json)
 * Created by: codex login (sign in with ChatGPT Plus/Pro)
 */
interface CodexAuth {
  access_token?: string;
  refresh_token?: string;
  account_id?: string;
  api_key?: string;
  expires_at?: number;
}

/**
 * Legacy cookie-based session (fallback)
 */
interface BrowserSession {
  cookies: string;
  lastUsed: number;
  csrfToken?: string;
}

// In-memory cache (5 min TTL)
let cachedAuth: { data: CodexAuth; loadedAt: number } | null = null;

/**
 * BrowserAuthTransformer
 *
 * Reads OpenAI Codex auth tokens from ~/.codex/auth.json and injects them
 * as Authorization headers against the standard OpenAI /v1/chat/completions API.
 *
 * This lets you use your ChatGPT Plus subscription instead of paying for API keys.
 *
 * Setup:
 *   1. npm install -g @openai/codex
 *   2. codex login  (sign in with ChatGPT in browser)
 *   3. Token saved to ~/.codex/auth.json
 *   4. Set auth_type: "browser" on your provider in config.json
 *   5. Point api_base_url to https://api.openai.com/v1/chat/completions
 *
 * Falls back to legacy cookie-based session files if no Codex auth found.
 */
export class BrowserAuthTransformer implements Transformer {
  name = "browser-auth";
  logger?: any;

  async transformRequestIn(
    request: UnifiedChatRequest,
    provider: LLMProvider,
    context: TransformerContext
  ): Promise<{ body: UnifiedChatRequest; config?: any }> {
    // Try Codex auth first (preferred)
    const codexAuth = await this.getCodexAuth(provider.browserAuth);
    if (codexAuth?.access_token) {
      this.logger?.info(`Using Codex OAuth token for ${provider.name}`);
      const headers: Record<string, string> = {
        Authorization: `Bearer ${codexAuth.access_token}`,
      };
      if (codexAuth.account_id) {
        headers["chatgpt-account-id"] = codexAuth.account_id;
      }
      return { body: request, config: { headers } };
    }

    // Fallback: Codex API key
    if (codexAuth?.api_key) {
      this.logger?.info(`Using Codex API key for ${provider.name}`);
      return {
        body: request,
        config: {
          headers: { Authorization: `Bearer ${codexAuth.api_key}` },
        },
      };
    }

    // Fallback: legacy cookie session
    const session = await this.getLegacySession(provider.name, provider.browserAuth);
    if (session) {
      this.logger?.info(`Using legacy cookie session for ${provider.name}`);
      return {
        body: request,
        config: {
          headers: {
            Cookie: session.cookies,
            "User-Agent":
              provider.browserAuth?.userAgent ||
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            ...(session.csrfToken ? { "X-CSRF-Token": session.csrfToken } : {}),
          },
        },
      };
    }

    this.logger?.warn(
      `No auth found for '${provider.name}'. Run: codex login`
    );
    return { body: request };
  }

  async transformResponseOut(
    response: Response,
    _context: TransformerContext
  ): Promise<Response> {
    return response;
  }

  /**
   * Read Codex auth.json (created by `codex login`)
   */
  private async getCodexAuth(browserAuth?: any): Promise<CodexAuth | null> {
    // Return cached if fresh (5 min)
    if (cachedAuth && Date.now() - cachedAuth.loadedAt < 5 * 60 * 1000) {
      return cachedAuth.data;
    }

    // Custom path or default Codex location
    const authFile =
      browserAuth?.codexAuthFile ||
      process.env.CODEX_HOME
        ? join(process.env.CODEX_HOME!, "auth.json")
        : join(homedir(), ".codex", "auth.json");

    try {
      const content = await promises.readFile(authFile, "utf-8");
      const auth = JSON.parse(content) as CodexAuth;
      cachedAuth = { data: auth, loadedAt: Date.now() };
      this.logger?.info(`Loaded Codex auth from ${authFile}`);
      return auth;
    } catch {
      return null;
    }
  }

  /**
   * Legacy: read cookie session file
   */
  private async getLegacySession(
    providerName: string,
    browserAuth?: any
  ): Promise<BrowserSession | null> {
    let sessionFile =
      browserAuth?.sessionFile ||
      join(homedir(), ".claude-code-router", "sessions", `${providerName}.json`);
    if (sessionFile.startsWith("~")) {
      sessionFile = join(homedir(), sessionFile.slice(1));
    }

    try {
      const content = await promises.readFile(sessionFile, "utf-8");
      return JSON.parse(content) as BrowserSession;
    } catch {
      return null;
    }
  }
}
