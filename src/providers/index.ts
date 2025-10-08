import { AIHookError } from "../errors";
import { callOpenAI } from "./openai";
import { callOpenRouter } from "./openrouter";
import { callGroq } from "./groq";
import { Provider } from "../types";
import { ProviderFunction, ProviderMap } from "../types/core/providers";

const providers: ProviderMap = {
    openai: callOpenAI,
    openrouter: callOpenRouter,
    groq: callGroq,
    mock: async (prompt: string, model?: string) => `[MOCK OUTPUT] ${prompt}`
};

// Returns an array of providers whose API keys exist in environment
export function getAvailableProviders(): Provider[] {
    const available: Provider[] = [];
    if (process.env.AI_HOOK_OPENAI_KEY) available.push("openai");
    if (process.env.AI_HOOK_OPENROUTER_KEY) available.push("openrouter");
    if (process.env.AI_HOOK_GROQ_KEY) available.push("groq");
    return available;
}

// ✅ Returns both the provider function and the actual provider name
export function getProvider(name?: Provider): { fn: ProviderFunction<any>; provider: Provider | "mock" } {
    const available = getAvailableProviders();

    // 1. If user specified provider and it's available
    if (name && providers[name]) {
        return { fn: providers[name], provider: name };
    }

    // 2. If at least one provider is available, pick the first one
    if (available.length > 0) {
        console.log(`[ai-hooks] ✅ Auto-selected provider: ${available[0]}`);
        return { fn: providers[available[0]], provider: available[0] };
    }

    // 3. No valid keys found → show error and fallback to mock
    const err = new AIHookError(
        "NO_PROVIDER_FOUND",
        "No valid AI provider API key was found.",
        undefined,
        "Please set one of: AI_HOOK_OPENAI_KEY, AI_HOOK_OPENROUTER_KEY, AI_HOOK_GROQ_KEY"
    );
    err.pretty();

    console.warn("[ai-hooks] ⚠️ Falling back to MOCK provider (no real API calls will be made).");

    return { fn: providers.mock, provider: "mock" };
}
