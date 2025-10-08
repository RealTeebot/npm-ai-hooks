import { OpenAIModel, OpenAIDefaultModel } from "./openai";
import { OpenRouterModel, OpenRouterDefaultModel } from "./openrouter";
import { GroqModel, GroqDefaultModel } from "./groq";

export type Provider = "openai" | "openrouter" | "groq";

export type ProviderModels = {
  openai: OpenAIModel;
  openrouter: OpenRouterModel;
  groq: GroqModel;
};

export const DEFAULT_MODEL: { [P in Provider]: ProviderModels[P] } = {
  openai: OpenAIDefaultModel,
  openrouter: OpenRouterDefaultModel,
  groq: GroqDefaultModel,
};

// Task types
export type TaskType =
  | "summarize"
  | "translate"
  | "explain"
  | "rewrite"
  | "sentiment"
  | "codeReview";

// Wrap options
export type WrapOptions<P extends Provider | undefined = undefined> =
  | {
      provider: P extends Provider ? P : never;
      model?: P extends Provider ? ProviderModels[P] : never;
      task: TaskType;
      targetLanguage?: string; // new optional
    }
  | { provider?: never; model?: never; task: TaskType; targetLanguage?: string };

