import dotenv from "dotenv";
dotenv.config();
import { wrap } from "../../src/wrap";

// Wrap the text function for translation to Urdu
const translate = wrap((text: string) => text, {
  task: "translate",
  provider: "openrouter",
  targetLanguage: "Roman Urdu" // specify target language
});

async function run() {
  const text = "Hello everyone! Welcome to OpenRouter demos.";

  const result = await translate(text);
  console.log(result.output);
}

run();
