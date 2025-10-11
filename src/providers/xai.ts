import axios from "axios";
import { AIHookError } from "../errors";
import { XAIModel } from "../types/xai";

const BASE_URL = "https://api.x.ai/v1";

export async function callXAI(prompt: string, model: XAIModel): Promise<string> {
  const apiKey = process.env.AI_HOOK_XAI_KEY;
  if (!apiKey) {
    throw new AIHookError(
      "INVALID_API_KEY",
      "Missing xAI API key.",
      "xai",
      "Set AI_HOOK_XAI_KEY in your environment variables."
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
        "xAI returned empty response",
        "xai",
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
          `xAI rejected the request: ${text}`,
          "xai",
          "Check your prompt and model"
        );
      if (status === 401)
        throw new AIHookError(
          "INVALID_API_KEY",
          `Invalid xAI API key: ${text}`,
          "xai",
          "Verify your AI_HOOK_XAI_KEY environment variable"
        );
      if (status === 429)
        throw new AIHookError(
          "RATE_LIMIT",
          `Too many requests to xAI: ${text}`,
          "xai",
          "Throttle requests or upgrade your plan"
        );

      throw new AIHookError(
        "PROVIDER_ERROR",
        `xAI API error: ${text}`,
        "xai"
      );
    } else if (err.request) {
      throw new AIHookError(
        "NETWORK_ERROR",
        "Network error while contacting xAI",
        "xai",
        "Check your internet connection"
      );
    } else {
      throw new AIHookError(
        "UNKNOWN_ERROR",
        err.message,
        "xai"
      );
    }
  }
}