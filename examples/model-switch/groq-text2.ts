import { wrap } from "../../src/wrap";

const explain = wrap((text: string) => text, { task: "explain", provider: "groq", model: "allam-2-7b" });

async function run() {
  const result = await explain("Groq's text-2 model is versatile for many tasks.");
  console.log(result.output);
}

run();
