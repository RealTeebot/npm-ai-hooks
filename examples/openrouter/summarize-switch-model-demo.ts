import dotenv from "dotenv";
dotenv.config();
import { wrap } from "../../src/wrap";
import { OpenRouterModel } from "../../src/types/openrouter";

const summarize = (model: OpenRouterModel) =>
  wrap((text: string) => text, { task: "summarize", provider: "openrouter", model });

async function run() {
  const text = "OpenRouter allows developers to switch AI models easily.";

  const models: OpenRouterModel[] = [
    "openai/gpt-oss-20b:free",
    "openai/gpt-5-pro",
    "openai/gpt-5-mini"
  ];

  for (const model of models) {
    console.log(`\n--- Using model: ${model} ---`);
    const result = await summarize(model)(text);
    console.log(result.output);
  }
}

run();
