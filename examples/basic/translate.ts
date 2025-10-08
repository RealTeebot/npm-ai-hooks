import { wrap } from "../../src/wrap";

const translate = wrap((text: string) => text, { task: "translate", targetLanguage: "Urdu" });

async function run() {
  const result = await translate("Hello everyone! Welcome to AI demos.");
  console.log(result.output);
}

run();
