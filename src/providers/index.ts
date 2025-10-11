import { AIHookError } from "../errors";
import { Provider } from "../types";
import { ProviderFunction, ProviderMap } from "../types/core/providers";
import { callOpenRouter } from "./openrouter";
import { callGroq } from "./groq";
import { callOpenAI } from "./openai";
import { callGemini } from "./gemini";
import { callClaude } from "./claude";
import { callDeepSeek } from "./deepkseek";
import { callXAI } from "./xai";
import { callPerplexity } from "./perplexity";
import { callMistral } from "./mistral";

const providers: ProviderMap = {
    openrouter: callOpenRouter,
    groq: callGroq,
    openai: callOpenAI,
    gemini: callGemini,
    claude: callClaude,
    deepseek: callDeepSeek,
    xai: callXAI,
    perplexity: callPerplexity,
    mistral: callMistral,
    mock: async (prompt: string, model?: string) => `[MOCK OUTPUT] ${prompt}`
};

// Returns an array of providers whose API keys exist in environment
export function getAvailableProviders(): Provider[] {
    const available: Provider[] = [];
    // Always prefer openrouter if present
    if (process.env.AI_HOOK_OPENROUTER_KEY) {
        available.push("openrouter");
    }
    // Add others in order of their presence
    if (process.env.AI_HOOK_GROQ_KEY && !available.includes("groq")) {
        available.push("groq");
    }
    if (process.env.AI_HOOK_OPENAI_KEY && !available.includes("openai")) {
        available.push("openai");
    }
    if (process.env.AI_HOOK_GEMINI_KEY && !available.includes("gemini")) {
        available.push("gemini");
    }
    if (process.env.AI_HOOK_CLAUDE_KEY && !available.includes("claude")) {
        available.push("claude");
    }
    if (process.env.AI_HOOK_DEEPSEEK_KEY && !available.includes("deepseek")) {
        available.push("deepseek");
    }
    if (process.env.AI_HOOK_XAI_KEY && !available.includes("xai")) {
        available.push("xai");
    }
    if (process.env.AI_HOOK_PERPLEXITY_KEY && !available.includes("perplexity")) {
        available.push("perplexity");
    }
    if (process.env.AI_HOOK_MISTRAL_KEY && !available.includes("mistral")) {
        available.push("mistral");
    }
    return available;
}

// ✅ Returns both the provider function and the actual provider name
export function getProvider(name?: Provider): { fn: ProviderFunction<any>; provider: Provider | "mock" } {
    const available = getAvailableProviders();

    // 1. If user specified provider and it's available
    if (name && providers[name]) {
        return { fn: providers[name], provider: name };
    }

    // 2. If at least one provider is available, pick the first one (openrouter always preferred if present)
    if (available.length > 0) {
        console.log(`[ai-hooks] ✅ Auto-selected provider: ${available[0]}`);
        return { fn: providers[available[0]], provider: available[0] };
    }

    // 3. No valid keys found → throw error (single instruction, no fallback)
    throw new AIHookError(
        "NO_PROVIDER_FOUND",
        "No valid AI provider API key was found.\n\nAt least one provider API key is required in your .env file.\n\nPlease add one of the following to your .env (see .env.example for details):\n  - AI_HOOK_OPENAI_KEY\n  - AI_HOOK_OPENROUTER_KEY\n  - AI_HOOK_GROQ_KEY\n",
        undefined,
        "Reference .env.example for setup instructions."
    );
}
