import fs from "fs/promises";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

import { LLMProvider, UnifiedChatRequest } from "@/types/llm";
import { Transformer, TransformerContext } from "@/types/transformer";

type CodexAuthFile = {
  account_id?: string;
  access_token?: string;
  api_key?: string;
  tokens?: {
    account_id?: string;
    access_token?: string;
  };
};

let cachedAuth:
  | {
      authFile: string;
      accountId?: string;
      token: string;
      loadedAt: number;
    }
  | null = null;

export class BrowserAuthTransformer implements Transformer {
  name = "browser-auth";
  logger?: any;

  async transformRequestIn(
    request: UnifiedChatRequest,
    provider: LLMProvider,
    context?: TransformerContext,
  ): Promise<{ body: UnifiedChatRequest; config: { headers: Record<string, string> } }> {
    const authFile =
      provider.browserAuth?.authFile ||
      provider.browserAuth?.codexAuthFile ||
      path.join(os.homedir(), ".codex", "auth.json");
    const { token, accountId } = await this.loadAuth(authFile);
    const sessionId = randomUUID();

    context?.req?.log?.debug?.({
      provider: provider.name,
      authFile,
    }, "Loaded browser auth token");

    return {
      body: request,
      config: {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(accountId ? { "chatgpt-account-id": accountId } : {}),
          Accept: "text/event-stream",
          "x-client-request-id": sessionId,
          session_id: sessionId,
          originator: "codex_cli",
        },
      },
    };
  }

  private async loadAuth(authFile: string): Promise<{
    token: string;
    accountId?: string;
  }> {
    if (
      cachedAuth &&
      cachedAuth.authFile === authFile &&
      Date.now() - cachedAuth.loadedAt < 5 * 60 * 1000
    ) {
      return {
        token: cachedAuth.token,
        accountId: cachedAuth.accountId,
      };
    }

    let raw: string;
    try {
      raw = await fs.readFile(authFile, "utf8");
    } catch (error) {
      throw new Error(`Browser auth file not found: ${authFile}`);
    }

    let parsed: CodexAuthFile;
    try {
      parsed = JSON.parse(raw) as CodexAuthFile;
    } catch {
      throw new Error(`Browser auth file is invalid JSON: ${authFile}`);
    }

    const token =
      parsed.tokens?.access_token ||
      parsed.access_token ||
      parsed.api_key;
    if (!token) {
      throw new Error(`No access token found in browser auth file: ${authFile}`);
    }

    const accountId = parsed.tokens?.account_id || parsed.account_id;

    cachedAuth = {
      authFile,
      accountId,
      token,
      loadedAt: Date.now(),
    };

    return {
      token,
      accountId,
    };
  }
}
