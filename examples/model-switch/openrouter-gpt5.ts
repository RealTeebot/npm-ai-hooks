import { wrap } from "../../src/wrap";

const summarize = wrap((text: string) => text, { task: "summarize", provider: "openrouter", model: "openai/gpt-5-pro" });

async function run() {
  const result = await summarize("OpenRouter supports multiple models including GPT-5.");
  console.log(result.output);
}

run();
