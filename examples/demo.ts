import { wrap } from "../src";

const summarize = wrap((text: string) => text, { task: "summarize" });

(async () => {
  try {
    const result = await summarize("Gemini is made by..");
    console.log(result.output);
  } catch (err: any) {
    if (err.pretty) {
      err.pretty(); // prints nice error with suggestions
    } else {
      console.error(err);
    }
  }
})();
