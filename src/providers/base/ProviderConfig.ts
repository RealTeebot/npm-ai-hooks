import { Provider, ProviderModels, DEFAULT_MODEL } from "../../types";
import { BaseProvider } from "./BaseProvider";
import { providerConfigs } from "./ProviderConfigs";
import { ClaudeProvider, GeminiProvider, OpenRouterProvider } from "./SpecializedProviders";

export interface UserProviderConfig {
  provider: Provider;
  key: string;
  defaultModel?: string; // Allow any string for default model
}

export interface ProviderInitializationOptions {
  providers: UserProviderConfig[];
  defaultProvider?: Provider;
}

export class ProviderManager {
  private providers = new Map<Provider, { key: string; defaultModel?: string }>();
  private defaultProvider?: Provider;
  private providerFunctions = new Map<Provider, any>();

  constructor(options: ProviderInitializationOptions) {
    this.initializeProviders(options);
  }

  private initializeProviders(options: ProviderInitializationOptions) {
    // Store provider configs
    for (const config of options.providers) {
      this.providers.set(config.provider, {
        key: config.key,
        defaultModel: config.defaultModel
      });
    }

    // Set default provider if specified
    this.defaultProvider = options.defaultProvider;

    // Create provider functions
    this.createProviderFunctions();
  }

  private createProviderFunctions() {
    for (const [providerName, config] of this.providers) {
      const providerFunction = this.createProviderFunction(providerName, config);
      this.providerFunctions.set(providerName, providerFunction);
    }
  }

  private createProviderFunction(providerName: Provider, config: { key: string; defaultModel?: string }) {
    return async (prompt: string, model?: string) => {
      // Use provided model or default model for this provider
      const modelToUse = model || config.defaultModel || this.getDefaultModelForProvider(providerName);
      
      // Create a temporary provider instance for this call
      const provider = this.createProviderInstance(providerName, config.key);
      return provider.call(prompt, modelToUse);
    };
  }

  private createProviderInstance(providerName: Provider, apiKey: string) {
    // Import the base provider and configs
    // Using imported classes directly

    const config = providerConfigs[providerName];
    if (!config) {
      throw new Error(`Unsupported provider: ${providerName}`);
    }

    // Create provider instance with the provided API key
    const providerConfig = { ...config };
    
    // Override the getApiKey method to return the provided key
    if (providerName === 'claude') {
      const provider = new ClaudeProvider();
      provider['getApiKey'] = () => apiKey;
      return provider;
    } else if (providerName === 'gemini') {
      const provider = new GeminiProvider();
      provider['getApiKey'] = () => apiKey;
      return provider;
    } else if (providerName === 'openrouter') {
      const provider = new OpenRouterProvider();
      provider['getApiKey'] = () => apiKey;
      return provider;
    } else {
      const provider = new BaseProvider(providerConfig);
      provider['getApiKey'] = () => apiKey;
      return provider;
    }
  }

  private getDefaultModelForProvider(providerName: Provider): string {
    // Import default models
    // Using imported DEFAULT_MODEL directly
    return DEFAULT_MODEL[providerName];
  }

  getAvailableProviders(): Provider[] {
    return Array.from(this.providers.keys());
  }

  getProvider(name?: Provider): { fn: any; provider: Provider } {
    const available = this.getAvailableProviders();

    if (available.length === 0) {
      throw new Error('No providers initialized. Please initialize providers first.');
    }

    // 1. If user specified provider and it's available
    if (name && this.providerFunctions.has(name)) {
      return { fn: this.providerFunctions.get(name), provider: name };
    }

    // 2. If default provider is specified and available
    if (this.defaultProvider && this.providerFunctions.has(this.defaultProvider)) {
      return { fn: this.providerFunctions.get(this.defaultProvider), provider: this.defaultProvider };
    }

    // 3. Prefer OpenRouter if available
    if (this.providerFunctions.has('openrouter')) {
      return { fn: this.providerFunctions.get('openrouter'), provider: 'openrouter' };
    }

    // 4. Use first available provider
    const firstProvider = available[0];
    return { fn: this.providerFunctions.get(firstProvider), provider: firstProvider };
  }

  addProvider(config: UserProviderConfig): void {
    this.providers.set(config.provider, {
      key: config.key,
      defaultModel: config.defaultModel
    });
    
    const providerFunction = this.createProviderFunction(config.provider, {
      key: config.key,
      defaultModel: config.defaultModel
    });
    this.providerFunctions.set(config.provider, providerFunction);
  }

  removeProvider(provider: Provider): void {
    this.providers.delete(provider);
    this.providerFunctions.delete(provider);
  }
}
