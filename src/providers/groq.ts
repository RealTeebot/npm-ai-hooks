import axios from "axios";
import { AIHookError } from "../errors";
import { GroqModel } from "../types/groq";

const BASE_URL = "https://api.groq.com/openai/v1";

export async function callGroq(prompt: string, model: GroqModel): Promise<string> {
  const apiKey = process.env.AI_HOOK_GROQ_KEY;
  if (!apiKey) {
    throw new AIHookError(
      "INVALID_API_KEY",
      "Missing Groq API key.",
      "groq",
      "Set AI_HOOK_GROQ_KEY in your environment variables."
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
        "Groq returned empty response",
        "groq",
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
          `Groq rejected the request: ${text}`,
          "groq",
          "Check your prompt and model"
        );
      if (status === 401)
        throw new AIHookError(
          "INVALID_API_KEY",
          `Invalid Groq API key: ${text}`,
          "groq",
          "Verify your AI_HOOK_GROQ_KEY environment variable"
        );
      if (status === 429)
        throw new AIHookError(
          "RATE_LIMIT",
          `Too many requests to Groq: ${text}`,
          "groq",
          "Throttle requests or upgrade your plan"
        );

      throw new AIHookError(
        "PROVIDER_ERROR",
        `Groq API error: ${text}`,
        "groq"
      );
    } else if (err.request) {
      throw new AIHookError(
        "NETWORK_ERROR",
        "Network error while contacting Groq",
        "groq",
        "Check your internet connection"
      );
    } else {
      throw new AIHookError(
        "UNKNOWN_ERROR",
        err.message,
        "groq"
      );
    }
  }
}
