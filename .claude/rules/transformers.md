# Transformer System

## How Transformers Work

Transformers adapt requests/responses between Claude Code's Anthropic format and each provider's format.

### Chain Order (Request)
1. `AnthropicTransformer.transformRequestOut()` - Anthropic -> unified/OpenAI format
2. Provider `transformer.use[].transformRequestIn()` - unified -> provider-specific
3. Model-specific `transformer[modelName].use[].transformRequestIn()` - model overrides

### Chain Order (Response - reverse)
1. Model-specific `transformResponseOut()`
2. Provider `transformResponseOut()`
3. `AnthropicTransformer.transformResponseIn()` - unified -> Anthropic SSE

## Built-in Transformers (case-sensitive names)

| Name | Endpoint | Purpose |
|------|----------|---------|
| `Anthropic` | `/v1/messages` | Claude Code entry point |
| `OpenAI` | `/v1/chat/completions` | OpenAI-compatible passthrough |
| `gemini` | `/v1beta/models/:modelAndAction` | Google Gemini API |
| `openrouter` | none | OpenRouter headers/format |
| `deepseek` | none | DeepSeek API |
| `browser-auth` | none | Cookie injection for browser auth |
| `tooluse` | none | Tool choice optimization |
| `reasoning` | none | Process reasoning_content field |
| `enhancetool` | none | Error tolerance for tool calls |
| `maxtoken` | none | Set max_tokens (accepts options) |

## Adding a Transformer

1. Create `packages/core/src/transformer/{name}.transformer.ts`
2. Implement `Transformer` interface from `@/types/transformer`
3. Set `name` property (this is the config reference name)
4. Export the class and register in `packages/core/src/transformer/index.ts`
5. Optionally set `endPoint` for a dedicated API route
