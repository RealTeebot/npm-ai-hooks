import { wrap } from "../../src/wrap";

const explain = wrap((text: string) => text, { task: "explain" });

async function run() {
  const result = await explain("Quantum computing is complex.");
  console.log(result.output);
}

run();
