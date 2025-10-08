import axios from "axios";
import { AIHookError } from "../errors";

const BASE_URL = "https://openrouter.ai/api/v1";

export async function callOpenRouter(prompt: string, model: string): Promise<string> {
  const apiKey = process.env.AI_HOOK_OPENROUTER_KEY;
  if (!apiKey) {
    throw new AIHookError(
      "INVALID_API_KEY",
      "Missing OpenRouter API key.",
      "openrouter",
      "Set AI_HOOK_OPENROUTER_KEY in your environment variables."
    );
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const output = response.data?.choices?.[0]?.message?.content;
    if (!output) {
      throw new AIHookError(
        "PROVIDER_ERROR",
        "OpenRouter returned empty response.",
        "openrouter",
        "Check that the model name is correct and your API key has access to it."
      );
    }

    return output;
  } catch (err: any) {
    if (err.response) {
      const status = err.response.status;
      // Make sure we get a string message
      const text = err.response.data?.error
        ? JSON.stringify(err.response.data.error)
        : err.response.statusText || "Unknown error";

      if (status === 400) throw new AIHookError(
        "BAD_REQUEST",
        `OpenRouter rejected the request: ${text}`,
        "openrouter",
        "Check your prompt, model name, and payload format."
      );
      if (status === 401) throw new AIHookError(
        "INVALID_API_KEY",
        `Invalid OpenRouter API key: ${text}`,
        "openrouter",
        "Verify your AI_HOOK_OPENROUTER_KEY environment variable."
      );
      if (status === 403) throw new AIHookError(
        "MODEL_NOT_ALLOWED",
        `Your API key cannot access this model: ${text}`,
        "openrouter",
        "Try a different model or check API key permissions."
      );
      if (status === 429) throw new AIHookError(
        "RATE_LIMIT",
        `Too many requests to OpenRouter: ${text}`,
        "openrouter",
        "Consider throttling requests or upgrading your plan."
      );

      throw new AIHookError(
        "PROVIDER_ERROR",
        `OpenRouter API error: ${text}`,
        "openrouter",
        "Check your model, prompt, and API key."
      );
    }

    else if (err.request) {
      throw new AIHookError(
        "NETWORK_ERROR",
        "Network error while contacting OpenRouter.",
        "openrouter",
        "Check your internet connection."
      );
    }
    else {
      throw new AIHookError(
        "UNKNOWN_ERROR",
        err.message,
        "openrouter"
      );
    }
  }
}
