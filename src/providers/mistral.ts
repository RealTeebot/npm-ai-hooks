import axios from "axios";
import { AIHookError } from "../errors";
import { MistralModel } from "../types/mistral";

const BASE_URL = "https://api.mistral.ai/v1";

export async function callMistral(prompt: string, model: MistralModel): Promise<string> {
  const apiKey = process.env.AI_HOOK_MISTRAL_KEY;
  if (!apiKey) {
    throw new AIHookError(
      "INVALID_API_KEY",
      "Missing Mistral API key.",
      "mistral",
      "Set AI_HOOK_MISTRAL_KEY in your environment variables."
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
        "Mistral returned empty response",
        "mistral",
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
          `Mistral rejected the request: ${text}`,
          "mistral",
          "Check your prompt and model"
        );
      if (status === 401)
        throw new AIHookError(
          "INVALID_API_KEY",
          `Invalid Mistral API key: ${text}`,
          "mistral",
          "Verify your AI_HOOK_MISTRAL_KEY environment variable"
        );
      if (status === 429)
        throw new AIHookError(
          "RATE_LIMIT",
          `Too many requests to Mistral: ${text}`,
          "mistral",
          "Throttle requests or upgrade your plan"
        );

      throw new AIHookError(
        "PROVIDER_ERROR",
        `Mistral API error: ${text}`,
        "mistral"
      );
    } else if (err.request) {
      throw new AIHookError(
        "NETWORK_ERROR",
        "Network error while contacting Mistral",
        "mistral",
        "Check your internet connection"
      );
    } else {
      throw new AIHookError(
        "UNKNOWN_ERROR",
        err.message,
        "mistral"
      );
    }
  }
}