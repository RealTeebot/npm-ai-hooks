import { AIHookError } from "../errors";
import { Provider } from "../types";
import { ProviderFunction } from "../types/core/providers";
import { ProviderMap } from "../types/core/providers";
import { providerRegistry } from "./base/ProviderRegistry";
import { providerConfigs } from "./base/ProviderConfigs";
import { BaseProvider } from "./base/BaseProvider";
import { ClaudeProvider, GeminiProvider, OpenRouterProvider } from "./base/SpecializedProviders";

// Import the new initialization system
import { 
  initAIHooks, 
  addProvider, 
  removeProvider, 
  getAvailableProviders as getNewAvailableProviders,
  getProvider as getNewProvider,
  isInitialized,
  reset,
  UserProviderConfig,
  ProviderInitializationOptions
} from "./init";

// Initialize all providers (legacy environment-based system)
function initializeProviders(): void {
  // Standard providers using BaseProvider
  const standardProviders = ['openai', 'groq', 'deepseek', 'mistral', 'xai', 'perplexity'] as const;
  
  standardProviders.forEach(providerName => {
    const config = providerConfigs[providerName];
    if (config) {
      const provider = new BaseProvider(config);
      providerRegistry.register(providerName as Provider, provider);
    }
  });

  // Specialized providers
  providerRegistry.register("claude", new ClaudeProvider());
  providerRegistry.register("gemini", new GeminiProvider());
  providerRegistry.register("openrouter", new OpenRouterProvider());
}

// Initialize providers on module load (legacy)
initializeProviders();

// Legacy compatibility - create the old provider map
const providers: ProviderMap = {
  openrouter: providerRegistry.get("openrouter")!,
  groq: providerRegistry.get("groq")!,
  openai: providerRegistry.get("openai")!,
  gemini: providerRegistry.get("gemini")!,
  claude: providerRegistry.get("claude")!,
  deepseek: providerRegistry.get("deepseek")!,
  xai: providerRegistry.get("xai")!,
  perplexity: providerRegistry.get("perplexity")!,
  mistral: providerRegistry.get("mistral")!,
  mock: async (prompt: string, model?: string) => `[MOCK OUTPUT] ${prompt}`
};

// Returns an array of providers whose API keys exist in environment (legacy)
export function getAvailableProviders(): Provider[] {
  // If new system is initialized, use it
  if (isInitialized()) {
    return getNewAvailableProviders();
  }
  
  // Otherwise use legacy system
  return providerRegistry.getAvailableProviders();
}

// Returns both the provider function and the actual provider name (legacy)
export function getProvider(name?: Provider): { fn: ProviderFunction<any>; provider: Provider | "mock" } {
  // If new system is initialized, use it
  if (isInitialized()) {
    const result = getNewProvider(name);
    return { fn: result.fn, provider: result.provider };
  }

  // Otherwise use legacy system
  const available = getAvailableProviders();

  // 1. If user specified provider and it's available
  if (name && providers[name]) {
    return { fn: providers[name], provider: name };
  }

  // 2. If at least one provider is available, pick the first one (openrouter always preferred if present)
  if (available.length > 0) {
    // Only log in non-test environments to avoid Jest warnings
    if (process.env.NODE_ENV !== "test" && !process.env.JEST_WORKER_ID) {
      console.log(`[ai-hooks] ✅ Auto-selected provider: ${available[0]}`);
    }
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

// Export the new initialization system
export { 
  initAIHooks, 
  addProvider, 
  removeProvider, 
  isInitialized,
  reset,
  UserProviderConfig,
  ProviderInitializationOptions
};

// Export the registry for advanced usage (legacy)
export { providerRegistry };
