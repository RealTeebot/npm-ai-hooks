import axios from "axios";
import { AIHookError } from "../errors";
import { GeminiModel } from "../types/gemini";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export async function callGemini(prompt: string, model: GeminiModel): Promise<string> {
  const apiKey = process.env.AI_HOOK_GEMINI_KEY;
  if (!apiKey) {
    throw new AIHookError(
      "INVALID_API_KEY",
      "Missing Gemini API key.",
      "gemini",
      "Set AI_HOOK_GEMINI_KEY in your environment variables."
    );
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!output) {
      throw new AIHookError(
        "PROVIDER_ERROR",
        "Gemini returned empty response",
        "gemini",
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
          `Gemini rejected the request: ${text}`,
          "gemini",
          "Check your prompt and model"
        );
      if (status === 401)
        throw new AIHookError(
          "INVALID_API_KEY",
          `Invalid Gemini API key: ${text}`,
          "gemini",
          "Verify your AI_HOOK_GEMINI_KEY environment variable"
        );
      if (status === 429)
        throw new AIHookError(
          "RATE_LIMIT",
          `Too many requests to Gemini: ${text}`,
          "gemini",
          "Throttle requests or upgrade your plan"
        );

      throw new AIHookError(
        "PROVIDER_ERROR",
        `Gemini API error: ${text}`,
        "gemini"
      );
    } else if (err.request) {
      throw new AIHookError(
        "NETWORK_ERROR",
        "Network error while contacting Gemini",
        "gemini",
        "Check your internet connection"
      );
    } else {
      throw new AIHookError(
        "UNKNOWN_ERROR",
        err.message,
        "gemini"
      );
    }
  }
}