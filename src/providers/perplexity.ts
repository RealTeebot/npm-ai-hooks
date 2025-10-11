import axios from "axios";
import { AIHookError } from "../errors";
import { PerplexityModel } from "../types/perplexity";

const BASE_URL = "https://api.perplexity.ai";

export async function callPerplexity(prompt: string, model: PerplexityModel): Promise<string> {
  const apiKey = process.env.AI_HOOK_PERPLEXITY_KEY;
  if (!apiKey) {
    throw new AIHookError(
      "INVALID_API_KEY",
      "Missing Perplexity API key.",
      "perplexity",
      "Set AI_HOOK_PERPLEXITY_KEY in your environment variables."
    );
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const output = response.data?.choices?.[0]?.message?.content;
    if (!output) {
      throw new AIHookError(
        "PROVIDER_ERROR",
        "Perplexity returned empty response",
        "perplexity",
        "Check your model and API key"
      );
    }

    return output;
  } catch (err: any) {
    if (err.response) {
      const status = err.response.status;
      const text = err.response.data?.error
        ? JSON.stringify(err.response.data.error)
        : err.response.statusText || "Unknown error";

      if (status === 400)
        throw new AIHookError(
          "BAD_REQUEST",
          `Perplexity rejected the request: ${text}`,
          "perplexity",
          "Check your prompt and model"
        );
      if (status === 401)
        throw new AIHookError(
          "INVALID_API_KEY",
          `Invalid Perplexity API key: ${text}`,
          "perplexity",
          "Verify your AI_HOOK_PERPLEXITY_KEY environment variable"
        );
      if (status === 429)
        throw new AIHookError(
          "RATE_LIMIT",
          `Too many requests to Perplexity: ${text}`,
          "perplexity",
          "Throttle requests or upgrade your plan"
        );

      throw new AIHookError(
        "PROVIDER_ERROR",
        `Perplexity API error: ${text}`,
        "perplexity"
      );
    } else if (err.request) {
      throw new AIHookError(
        "NETWORK_ERROR",
        "Network error while contacting Perplexity",
        "perplexity",
        "Check your internet connection"
      );
    } else {
      throw new AIHookError(
        "UNKNOWN_ERROR",
        err.message,
        "perplexity"
      );
    }
  }
}