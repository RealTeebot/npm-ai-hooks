import axios from "axios";
import { AIHookError } from "../errors";
import { DeepSeekModel } from "../types/deepseek";

const BASE_URL = "https://api.deepseek.com/v1";

export async function callDeepSeek(prompt: string, model: DeepSeekModel): Promise<string> {
  const apiKey = process.env.AI_HOOK_DEEPSEEK_KEY;
  if (!apiKey) {
    throw new AIHookError(
      "INVALID_API_KEY",
      "Missing DeepSeek API key.",
      "deepseek",
      "Set AI_HOOK_DEEPSEEK_KEY in your environment variables."
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
        "DeepSeek returned empty response",
        "deepseek",
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
          `DeepSeek rejected the request: ${text}`,
          "deepseek",
          "Check your prompt and model"
        );
      if (status === 401)
        throw new AIHookError(
          "INVALID_API_KEY",
          `Invalid DeepSeek API key: ${text}`,
          "deepseek",
          "Verify your AI_HOOK_DEEPSEEK_KEY environment variable"
        );
      if (status === 429)
        throw new AIHookError(
          "RATE_LIMIT",
          `Too many requests to DeepSeek: ${text}`,
          "deepseek",
          "Throttle requests or upgrade your plan"
        );

      throw new AIHookError(
        "PROVIDER_ERROR",
        `DeepSeek API error: ${text}`,
        "deepseek"
      );
    } else if (err.request) {
      throw new AIHookError(
        "NETWORK_ERROR",
        "Network error while contacting DeepSeek",
        "deepseek",
        "Check your internet connection"
      );
    } else {
      throw new AIHookError(
        "UNKNOWN_ERROR",
        err.message,
        "deepseek"
      );
    }
  }
}