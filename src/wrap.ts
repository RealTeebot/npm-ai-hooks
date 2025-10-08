import { getProvider } from "./providers";
import { WrapOptions, TaskType, Provider, DEFAULT_MODEL } from "./types";

export function wrap<T extends (...args: any[]) => any, P extends Provider | undefined = undefined>(
  fn: T,
  options: WrapOptions<P>
) {
  return async (...args: Parameters<T>) => {
    const input = fn(...args);

    // Step 1: get provider function and the actual provider name
    const { fn: providerFn, provider: providerKey } = getProvider(options.provider as Provider | undefined);

    // Step 2: pick model: passed model or provider-specific default
    const model = options.model || (providerKey in DEFAULT_MODEL ? DEFAULT_MODEL[providerKey as Provider] : undefined);

    if (!model) {
      throw new Error(
        "No model found: You must specify a provider or pass a valid model."
      );
    }

    // Step 3: build prompt
    const prompt = buildPrompt(options.task, input, (options as any).targetLanguage);


    const startTime = Date.now();
    let output: string;
    try {
      output = await providerFn(prompt, model);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if ((err as any).name === "AIHookError") throw err;
        throw new Error(`[ai-hooks] Unknown error calling provider: ${err.message}`);
      }
      throw new Error(`[ai-hooks] Unknown non-error thrown by provider: ${String(err)}`);
    }
    const endTime = Date.now();

    return {
      output,
      meta: {
        provider: providerKey,
        model,
        cached: false,
        estimatedCostUSD: 0.0,
        latencyMs: endTime - startTime
      }
    };
  };
}

function buildPrompt(task: TaskType, text: string, targetLanguage?: string) {
  switch (task) {
    case "summarize":
      return `Summarize the following text:\n${text}`;
    case "translate":
      const language = targetLanguage || "English"; // default to English
      return `Translate this text into ${language}:\n${text}`;
    case "explain":
      return `Explain this clearly:\n${text}`;
    case "rewrite":
      return `Rewrite this text with better clarity:\n${text}`;
    case "sentiment":
      return `Analyze the sentiment of this text:\n${text}`;
    case "codeReview":
      return `Review this code and suggest improvements:\n${text}`;
    default:
      return text;
  }
}