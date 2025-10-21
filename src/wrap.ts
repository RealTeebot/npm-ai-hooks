// dotenv removed - using explicit provider initialization instead
import { getProvider } from "./providers";
import { WrapOptions, TaskType, Provider, DEFAULT_MODEL } from "./types";
import { AIHookError } from "./errors";

function handleError(err: unknown): never {
  if (err && typeof err === "object" && "pretty" in err && typeof (err as any).pretty === "function") {
    // Print pretty message
    console.error((err as any).pretty());
    // Only exit in Node.js test environment, not in browser
    if (typeof process !== "undefined" && process.env.NODE_ENV !== "test" && !process.env.JEST_WORKER_ID) {
      process.exit(1);
    }
    // In browser or test mode, just throw the error instead of exiting
    throw err;
  } else {
    console.error(err);
    // Only exit in Node.js test environment, not in browser
    if (typeof process !== "undefined" && process.env.NODE_ENV !== "test" && !process.env.JEST_WORKER_ID) {
      process.exit(1);
    }
    // In browser or test mode, just throw the error instead of exiting
    throw err;
  }
}

export function wrap<T extends (...args: any[]) => any, P extends Provider | undefined = undefined>(
  fn: T,
  options: WrapOptions<P>
): (...args: Parameters<T>) => Promise<{ output: string; meta: any }> {
  // Validate task type immediately when wrap() is called
  const validTasks: TaskType[] = ["summarize", "translate", "explain", "rewrite", "sentiment", "codeReview"];
  if (options.task && !validTasks.includes(options.task)) {
    throw new AIHookError(
      "INVALID_TASK",
      `Invalid task type: ${options.task}. Valid tasks are: ${validTasks.join(", ")}`,
      options.provider as Provider | undefined,
      "Please use one of the supported task types."
    );
  }

  return async (...args: Parameters<T>) => {
    try {
      const input = fn(...args);

      // Step 1: get provider function and the actual provider name
      const { fn: providerFn, provider: providerKey } = getProvider(options.provider as Provider | undefined);

      // Step 2: pick model: passed model or provider-specific default
      const model = options.model || (providerKey in DEFAULT_MODEL ? DEFAULT_MODEL[providerKey as Provider] : undefined);

      if (!model) {
        throw new AIHookError(
          "NO_MODEL_FOUND",
          "No model found: You must specify a provider or pass a valid model.\n\nAt least one provider API key is required in your .env file.\n\nPlease add one of the following to your .env (see .env.example for details):\n  - AI_HOOK_OPENAI_KEY\n  - AI_HOOK_OPENROUTER_KEY\n  - AI_HOOK_GROQ_KEY\n",
          options.provider as Provider | undefined,
          "Reference .env.example for setup instructions."
        );
      }

      // Step 3: build prompt
      const prompt = buildPrompt(options.task, input, (options as any).targetLanguage);

      const startTime = Date.now();
      let output: string;
      try {
        output = await providerFn(prompt, model);
      } catch (err: unknown) {
        if (err instanceof AIHookError) {
          // For AIHookError, just re-throw it - it will be handled by the outer catch
          throw err;
        }
        if (err instanceof Error) {
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
    } catch (err) {
      if (err instanceof AIHookError) {
        // For AIHookError, just log the pretty message without the full error handling
        console.error((err as any).pretty());
        // Return a mock response to prevent the demo from crashing
        return {
          output: "Error occurred",
          meta: {
            provider: "unknown",
            model: "unknown",
            cached: false,
            estimatedCostUSD: 0.0,
            latencyMs: 0,
            error: true
          }
        };
      }
      handleError(err);
    }
  };
}

function buildPrompt(task: TaskType | undefined, text: string, targetLanguage?: string) {
  if (!task) {
    return text; // If no task specified, just return the text as-is
  }
  
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