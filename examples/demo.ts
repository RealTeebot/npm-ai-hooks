import { wrap } from "../src";

const summarize = wrap((text: string) => text, { task: "summarize" });

(async () => {
  try {
    const result = await summarize("OpenRouter is a great tool for AI integration...");
    console.log(result.output);
  } catch (err: any) {
    if (err.pretty) {
      err.pretty(); // prints nice error with suggestions
    } else {
      console.error(err);
    }
  }
})();
