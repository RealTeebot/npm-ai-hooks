import { wrap } from "../../src/wrap";

const summarize = wrap((text: string) => text, { task: "summarize", provider: "openrouter" });

async function run() {
  const result = await summarize("OpenRouter makes AI integration seamless.");
  console.log(result.output);
}

run();
