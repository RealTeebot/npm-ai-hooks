import dotenv from "dotenv";
dotenv.config();
import { wrap } from "../../src/wrap";
import { OpenRouterModel } from "../../src/types/openrouter";

const translate = (model: OpenRouterModel) =>
  wrap((text: string) => text, { task: "translate", provider: "openrouter", model });

async function run() {
  const text = "Bonjour tout le monde!";

  const models: OpenRouterModel[] = [
    "openai/gpt-4.1",
    "openai/gpt-5-chat"
  ];

  for (const model of models) {
    console.log(`\n--- Using model: ${model} ---`);
    const result = await translate(model)(text);
    console.log(result.output);
  }
}

run();
