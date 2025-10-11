import axios from "axios";
import { AIHookError } from "../errors";
import { ClaudeModel } from "../types/claude";

const BASE_URL = "https://api.anthropic.com/v1";
const ANTHROPIC_VERSION = "2023-06-01";

export async function callClaude(prompt: string, model: ClaudeModel): Promise<string> {
  const apiKey = process.env.AI_HOOK_CLAUDE_KEY;
  if (!apiKey) {
    throw new AIHookError(
      "INVALID_API_KEY",
      "Missing Claude API key.",
      "claude",
      "Set AI_HOOK_CLAUDE_KEY in your environment variables."
    );
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/messages`,
      {
        model,
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
          "Content-Type": "application/json"
        }
      }
    );

    const output = response.data?.content?.[0]?.text;
    if (!output) {
      throw new AIHookError(
        "PROVIDER_ERROR",
        "Claude returned empty response",
        "claude",
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
          `Claude rejected the request: ${text}`,
          "claude",
          "Check your prompt and model"
        );
      if (status === 401)
        throw new AIHookError(
          "INVALID_API_KEY",
          `Invalid Claude API key: ${text}`,
          "claude",
          "Verify your AI_HOOK_CLAUDE_KEY environment variable"
        );
      if (status === 429)
        throw new AIHookError(
          "RATE_LIMIT",
          `Too many requests to Claude: ${text}`,
          "claude",
          "Throttle requests or upgrade your plan"
        );

      throw new AIHookError(
        "PROVIDER_ERROR",
        `Claude API error: ${text}`,
        "claude"
      );
    } else if (err.request) {
      throw new AIHookError(
        "NETWORK_ERROR",
        "Network error while contacting Claude",
        "claude",
        "Check your internet connection"
      );
    } else {
      throw new AIHookError(
        "UNKNOWN_ERROR",
        err.message,
        "claude"
      );
    }
  }
}