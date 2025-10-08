import { wrap } from "../../src/wrap";

const rewrite = wrap((text: string) => text, { task: "rewrite" });

async function run() {
  const result = await rewrite("AI code can sometimes be confusing.");
  console.log(result.output);
}

run();
