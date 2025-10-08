import { wrap } from "../../src/wrap";

const explain = wrap((text: string) => text, { task: "explain" });

async function run() {
  try {
    const result = await explain("Quantum computing is complex.");
    console.log(result.output);
  } catch (err: any) {
    if (err && typeof err.pretty === "function") {
      err.pretty();
    } else {
      console.error(err.message || err);
    }
  }
}

run();
