import { wrap } from "../../src/wrap";

const sentiment = wrap((text: string) => text, { task: "sentiment" });

async function run() {
  const result = await sentiment("I love using AI-Hooks for my projects!");
  console.log(result.output);
}

run();
