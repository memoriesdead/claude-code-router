/**
 * First-run setup wizard
 * Automatically triggered when config has no providers configured.
 * Goal: one command (`npx @musistudio/claude-code-router code`) and it works.
 */

import { input, select, confirm, password } from "@inquirer/prompts";
import { writeConfigFile, readConfigFile, initDir } from ".";

// ANSI colors
const RESET = "\x1B[0m";
const BOLD = "\x1B[1m";
const GREEN = "\x1B[32m";
const CYAN = "\x1B[36m";
const YELLOW = "\x1B[33m";
const DIM = "\x1B[2m";

interface SetupResult {
  providers: any[];
  router: any;
  fallback?: any;
}

export async function needsSetup(): Promise<boolean> {
  try {
    const config = await readConfigFile();
    return !config.Providers || config.Providers.length === 0;
  } catch {
    return true;
  }
}

export async function runSetupWizard(): Promise<void> {
  console.log(`
${BOLD}${CYAN}╔══════════════════════════════════════════════╗
║       Claude Code Router - Quick Setup       ║
╚══════════════════════════════════════════════╝${RESET}
`);
  console.log(`${DIM}This wizard will set up your LLM providers.${RESET}`);
  console.log(`${DIM}You can always edit ~/.claude-code-router/config.json later.${RESET}\n`);

  await initDir();

  const result: SetupResult = { providers: [], router: {} };

  // Ask which providers to set up
  const providerChoice = await select({
    message: "Which provider do you want to use?",
    choices: [
      { name: "Gemini API (recommended - free tier available)", value: "gemini" },
      { name: "OpenAI API (requires API key)", value: "openai" },
      { name: "ChatGPT Browser Auth (use your Plus subscription)", value: "chatgpt" },
      { name: "OpenRouter (multi-provider, single key)", value: "openrouter" },
      { name: "Custom provider", value: "custom" },
    ],
  });

  switch (providerChoice) {
    case "gemini":
      await setupGemini(result);
      break;
    case "openai":
      await setupOpenAI(result);
      break;
    case "chatgpt":
      await setupChatGPT(result);
      break;
    case "openrouter":
      await setupOpenRouter(result);
      break;
    case "custom":
      await setupCustom(result);
      break;
  }

  // Ask if they want to add another provider
  const addMore = await confirm({
    message: "Add another provider? (useful for fallbacks)",
    default: false,
  });

  if (addMore) {
    const secondChoice = await select({
      message: "Which additional provider?",
      choices: [
        { name: "Gemini API", value: "gemini" },
        { name: "OpenAI API", value: "openai" },
        { name: "ChatGPT Browser Auth", value: "chatgpt" },
        { name: "OpenRouter", value: "openrouter" },
        { name: "Custom provider", value: "custom" },
      ].filter(c => c.value !== providerChoice),
    });

    switch (secondChoice) {
      case "gemini":
        await setupGemini(result);
        break;
      case "openai":
        await setupOpenAI(result);
        break;
      case "chatgpt":
        await setupChatGPT(result);
        break;
      case "openrouter":
        await setupOpenRouter(result);
        break;
      case "custom":
        await setupCustom(result);
        break;
    }
  }

  // Auto-configure router if not set yet
  if (!result.router.default && result.providers.length > 0) {
    const first = result.providers[0];
    const model = first.models[0];
    result.router.default = `${first.name},${model}`;

    // Set background to cheapest model available
    const cheapModel = findCheapestModel(result.providers);
    if (cheapModel) {
      result.router.background = cheapModel;
    }

    // Set think to most capable model
    const thinkModel = findThinkModel(result.providers);
    if (thinkModel) {
      result.router.think = thinkModel;
    }

    // Set long context to Gemini if available (1M context)
    const geminiProvider = result.providers.find(p => p.name === "gemini");
    if (geminiProvider) {
      const proModel = geminiProvider.models.find((m: string) => m.includes("pro"));
      if (proModel) {
        result.router.longContext = `gemini,${proModel}`;
      }
    }
  }

  // Write config
  const config: any = {
    LOG: true,
    LOG_LEVEL: "info",
    API_TIMEOUT_MS: 600000,
    Providers: result.providers,
    Router: result.router,
  };

  if (result.fallback) {
    config.fallback = result.fallback;
  }

  await writeConfigFile(config);

  console.log(`
${BOLD}${GREEN}Setup complete!${RESET}

${BOLD}Configuration:${RESET}
  Default model:    ${config.Router.default || "not set"}
  Background model: ${config.Router.background || "same as default"}
  Think model:      ${config.Router.think || "same as default"}
  Long context:     ${config.Router.longContext || "same as default"}

${BOLD}Config saved to:${RESET} ~/.claude-code-router/config.json

${BOLD}${CYAN}Starting Claude Code Router...${RESET}
`);
}

async function setupGemini(result: SetupResult): Promise<void> {
  console.log(`\n${BOLD}Gemini API Setup${RESET}`);
  console.log(`${DIM}Get your API key at: https://aistudio.google.com/apikey${RESET}\n`);

  const apiKey = await password({
    message: "Gemini API key:",
    mask: "*",
  });

  const modelChoice = await select({
    message: "Which Gemini model as default?",
    choices: [
      { name: "Gemini 2.5 Pro (best quality, thinking)", value: "gemini-2.5-pro" },
      { name: "Gemini 2.5 Flash (fast, cheap)", value: "gemini-2.5-flash" },
    ],
  });

  const models = ["gemini-2.5-pro", "gemini-2.5-flash"];

  result.providers.push({
    name: "gemini",
    api_base_url: "https://generativelanguage.googleapis.com/v1beta/models/",
    api_key: apiKey,
    models,
    transformer: { use: ["gemini"] },
  });

  result.router.default = `gemini,${modelChoice}`;
  result.router.background = "gemini,gemini-2.5-flash";
  result.router.think = "gemini,gemini-2.5-pro";
  result.router.longContext = "gemini,gemini-2.5-pro";
  result.router.longContextThreshold = 60000;
  result.router.webSearch = "gemini,gemini-2.5-flash";

  console.log(`${GREEN}Gemini configured.${RESET}`);
}

async function setupOpenAI(result: SetupResult): Promise<void> {
  console.log(`\n${BOLD}OpenAI API Setup${RESET}\n`);

  const apiKey = await password({
    message: "OpenAI API key (sk-...):",
    mask: "*",
  });

  result.providers.push({
    name: "openai",
    api_base_url: "https://api.openai.com/v1/chat/completions",
    api_key: apiKey,
    models: ["gpt-4o", "gpt-4o-mini"],
  });

  if (!result.router.default) {
    result.router.default = "openai,gpt-4o";
    result.router.background = "openai,gpt-4o-mini";
    result.router.think = "openai,gpt-4o";
  }

  console.log(`${GREEN}OpenAI configured.${RESET}`);
}

async function setupChatGPT(result: SetupResult): Promise<void> {
  console.log(`\n${BOLD}ChatGPT Browser Auth Setup${RESET}`);
  console.log(`${DIM}This uses your ChatGPT Plus/Pro subscription via browser cookies.${RESET}`);
  console.log(`${DIM}No API key needed - but you must export cookies from your browser.${RESET}\n`);

  console.log(`${YELLOW}Steps to get cookies:${RESET}`);
  console.log(`  1. Log in to https://chatgpt.com in your browser`);
  console.log(`  2. Open DevTools (F12) > Application > Cookies`);
  console.log(`  3. Copy all cookie values as a semicolon-separated string`);
  console.log(`  4. Paste below\n`);

  const hasCookies = await confirm({
    message: "Do you have your browser cookies ready?",
    default: false,
  });

  if (hasCookies) {
    const cookies = await input({
      message: "Paste your cookies string:",
    });

    // Save session file
    const os = require("os");
    const fs = require("fs/promises");
    const path = require("path");
    const sessionDir = path.join(os.homedir(), ".claude-code-router", "sessions");
    await fs.mkdir(sessionDir, { recursive: true });
    await fs.writeFile(
      path.join(sessionDir, "chatgpt.json"),
      JSON.stringify({ cookies, lastUsed: Date.now() }, null, 2)
    );
    console.log(`${GREEN}Session saved to ~/.claude-code-router/sessions/chatgpt.json${RESET}`);
  } else {
    console.log(`${YELLOW}You can add cookies later to: ~/.claude-code-router/sessions/chatgpt.json${RESET}`);
  }

  result.providers.push({
    name: "chatgpt",
    api_base_url: "https://chatgpt.com/backend-api/conversation",
    auth_type: "browser",
    models: ["gpt-4o", "gpt-4o-mini"],
    transformer: { use: ["browser-auth", "openai"] },
  });

  if (!result.router.default) {
    result.router.default = "chatgpt,gpt-4o";
    result.router.background = "chatgpt,gpt-4o-mini";
    result.router.think = "chatgpt,gpt-4o";
  }

  console.log(`${GREEN}ChatGPT browser auth configured.${RESET}`);
}

async function setupOpenRouter(result: SetupResult): Promise<void> {
  console.log(`\n${BOLD}OpenRouter Setup${RESET}`);
  console.log(`${DIM}One API key for many models: https://openrouter.ai/keys${RESET}\n`);

  const apiKey = await password({
    message: "OpenRouter API key:",
    mask: "*",
  });

  result.providers.push({
    name: "openrouter",
    api_base_url: "https://openrouter.ai/api/v1/chat/completions",
    api_key: apiKey,
    models: [
      "google/gemini-2.5-pro-preview",
      "anthropic/claude-sonnet-4",
      "deepseek/deepseek-chat",
    ],
    transformer: { use: ["openrouter"] },
  });

  if (!result.router.default) {
    result.router.default = "openrouter,google/gemini-2.5-pro-preview";
    result.router.background = "openrouter,deepseek/deepseek-chat";
    result.router.think = "openrouter,anthropic/claude-sonnet-4";
  }

  console.log(`${GREEN}OpenRouter configured.${RESET}`);
}

async function setupCustom(result: SetupResult): Promise<void> {
  console.log(`\n${BOLD}Custom Provider Setup${RESET}\n`);

  const name = await input({
    message: "Provider name (e.g., 'deepseek', 'ollama'):",
  });

  const baseUrl = await input({
    message: "API base URL (full endpoint):",
    default: "https://api.example.com/v1/chat/completions",
  });

  const apiKey = await password({
    message: "API key:",
    mask: "*",
  });

  const modelsStr = await input({
    message: "Model names (comma-separated):",
  });
  const models = modelsStr.split(",").map(m => m.trim()).filter(Boolean);

  const transformer = await select({
    message: "Transformer (adapts API format):",
    choices: [
      { name: "None (OpenAI-compatible)", value: "" },
      { name: "deepseek", value: "deepseek" },
      { name: "gemini", value: "gemini" },
      { name: "openrouter", value: "openrouter" },
      { name: "groq", value: "groq" },
    ],
  });

  const provider: any = {
    name,
    api_base_url: baseUrl,
    api_key: apiKey,
    models,
  };

  if (transformer) {
    provider.transformer = { use: [transformer] };
  }

  result.providers.push(provider);

  if (!result.router.default && models.length > 0) {
    result.router.default = `${name},${models[0]}`;
  }

  console.log(`${GREEN}${name} configured.${RESET}`);
}

function findCheapestModel(providers: any[]): string | null {
  // Prefer flash/mini models for background tasks
  const cheapPatterns = ["flash", "mini", "haiku", "small"];
  for (const provider of providers) {
    for (const model of provider.models) {
      if (cheapPatterns.some(p => model.toLowerCase().includes(p))) {
        return `${provider.name},${model}`;
      }
    }
  }
  return null;
}

function findThinkModel(providers: any[]): string | null {
  // Prefer pro/opus models for thinking
  const thinkPatterns = ["pro", "opus", "o1", "reasoner"];
  for (const provider of providers) {
    for (const model of provider.models) {
      if (thinkPatterns.some(p => model.toLowerCase().includes(p))) {
        return `${provider.name},${model}`;
      }
    }
  }
  return null;
}
