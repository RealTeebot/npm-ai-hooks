import { wrap } from "../../src/wrap";

const summarize = wrap((text: string) => text, { task: "summarize" });

async function run() {
  const result = await summarize("OpenRouter is a powerful AI integration tool.");
  console.log(result.output);
}

run();
