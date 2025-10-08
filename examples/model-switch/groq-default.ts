import { wrap } from "../../src/wrap";

const explain = wrap((text: string) => text, { task: "explain", provider: "groq" });

async function run() {
  const result = await explain("Groq provides fast text AI models.");
  console.log(result.output);
}

run();
