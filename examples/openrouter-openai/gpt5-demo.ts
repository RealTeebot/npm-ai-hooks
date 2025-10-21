// dotenv removed - using explicit provider initialization instead
import { wrap } from "../../src/wrap";
import { OpenRouterModel } from "../../src/types/openrouter";

const summarize = (model: OpenRouterModel) =>
  wrap((text: string) => text, { task: "summarize", provider: "openrouter", model });

async function run() {
  const text = "This is a demonstration of switching OpenRouter models to GPT-5 variants.";

  const models: OpenRouterModel[] = [
    "openai/gpt-5",
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
