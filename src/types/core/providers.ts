import { Provider, ProviderModels } from "../index"; 

export interface ProviderFunction<P extends Provider = Provider> {
  (prompt: string, model: ProviderModels[P]): Promise<string>;
}

export interface ProviderMap {
    openai: ProviderFunction<"openai">;
    openrouter: ProviderFunction<"openrouter">;
    groq: ProviderFunction<"groq">;
    mock: ProviderFunction<any>; // generic fallback for mock
  }
  