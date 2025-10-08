# npm-ai-hooks 🧠

**Universal AI Hook Layer for Node.js – one wrapper for all AI providers.**
Inject LLM-like behavior into any JavaScript or TypeScript function with a single line, without writing prompts, handling SDKs, or locking into any provider.

---

## 🚀 Features

* ✨ **Universal API:** Works with OpenAI, Claude, Gemini, DeepSeek, Groq, and more — out of the box.
* 🔁 **Plug & Play:** Wrap any function and instantly give it AI-powered behavior.
* 📦 **Zero Prompting:** Built-in task templates (summarize, explain, translate, sentiment, rewrite, code-review, etc.)
* 🔄 **Auto Provider Selection:** Detects available providers automatically from environment variables.
* ⚙️ **Configurable:** Choose provider, model, temperature, and more per call.
* 🔒 **Error Safe:** Handles invalid keys, unauthorized models, rate limits, and more gracefully.
* 💰 **Cost Awareness:** Estimate and log token usage and cost before and after calls.
* 🧠 **Caching:** Prevents duplicate calls and charges by caching results intelligently.
* 🔌 **Extensible:** Add your own providers and custom tasks easily.
* 🛠️ **Debug Friendly:** Full debug logging with `AI_HOOK_DEBUG=true`.

---

## 📦 Installation

```bash
npm install npm-ai-hooks
# or
yarn add npm-ai-hooks
```

---

## 🧪 Quick Start

```js
const ai = require("npm-ai-hooks");

// Wrap any function
const summarize = ai.wrap(text => text, { task: "summarize" });

(async () => {
  const result = await summarize("Node.js is a JavaScript runtime built on Chrome's V8...");
  console.log(result.output); // "Node.js is a JS runtime for building server-side apps."
})();
```

---

## 🔑 Environment Setup

Set one or more API keys in your `.env` file (or system environment):

```
AI_HOOK_OPENAI_KEY=sk-...
AI_HOOK_CLAUDE_KEY=sk-...
AI_HOOK_GEMINI_KEY=AIza...
AI_HOOK_DEEPSEEK_KEY=ds-...
AI_HOOK_GROQ_KEY=gr-...

AI_HOOK_DEFAULT_PROVIDER=openai
```

If no provider is explicitly set, `npm-ai-hooks` will:

1. Use `AI_HOOK_DEFAULT_PROVIDER` if defined.
2. Auto-detect the first available provider.
3. Throw an error if none are available.

---

## 📚 Usage Examples

### 1. Basic Summarization

```js
const summarize = ai.wrap(text => text, { task: "summarize" });
console.log(await summarize("Long article text..."));
```

---

### 2. Custom Provider + Model

```js
const explain = ai.wrap(t => t, {
  task: "explain",
  provider: "claude",
  model: "claude-3-opus"
});

console.log(await explain("Explain quantum computing like I'm 10."));
```

---

### 3. AI Pipelines

```js
const summarize = ai.wrap(t => t, { task: "summarize" });
const translate = ai.wrap(t => t, { task: "translate", lang: "fr" });

const result = await translate(await summarize("Long technical article..."));
console.log(result.output); // Résumé en français
```

---

### 4. Built-in Tasks

| Task         | Description                              |
| ------------ | ---------------------------------------- |
| `summarize`  | Summarize text into concise form         |
| `translate`  | Translate text to a target language      |
| `explain`    | Explain complex text simply              |
| `rewrite`    | Rephrase text for tone/clarity           |
| `sentiment`  | Analyze emotional tone of text           |
| `codeReview` | Review code and provide feedback         |
| `docstring`  | Generate function documentation comments |

---

## ⚙️ Advanced Configuration

### Caching

```js
const summarize = ai.wrap(t => t, { task: "summarize", cache: true });
```

* Cache keys are based on task + input + model.
* TTL defaults to 24h (configurable).
* Clear manually with:

  ```js
  await ai.clearCache();
  ```

---

### Cost Awareness

Get detailed cost + token usage metadata:

```js
const summarize = ai.wrap(t => t, { task: "summarize" });
const result = await summarize(longText);

console.log(result.meta);
/*
{
  provider: "openai",
  model: "gpt-4o",
  cached: false,
  estimatedCostUSD: 0.0013,
  totalCostUSD: 0.0012,
  inputTokens: 326,
  outputTokens: 127,
  latencyMs: 812
}
*/
```

---

### Error Handling

All errors follow a unified structure:

```js
try {
  await summarize("...");
} catch (err) {
  console.error(err);
  /*
  {
    code: "MODEL_NOT_ALLOWED",
    message: "Your API key does not have access to gpt-4o",
    provider: "openai",
    suggestion: "Upgrade your plan or choose another model."
  }
  */
}
```

---

### Debugging

Enable verbose logs:

```
AI_HOOK_DEBUG=true
```

Output example:

```
[ai-hooks] Using provider: OpenAI (gpt-4o)
[ai-hooks] Estimated cost: $0.0012
[ai-hooks] Cache: MISS
[ai-hooks] Response received in 812ms
```

---

## 🧩 Extending with Custom Providers

You can add support for any model/service:

```js
ai.registerProvider({
  name: "my-llm",
  isAvailable: () => !!process.env.MY_LLM_KEY,
  generate: async (prompt, options) => {
    const res = await fetch("https://my-llm.com/api", { ... });
    return await res.text();
  }
});
```

---

## 🧠 Roadmap

* [ ] Streaming output support
* [ ] Cost ceiling + auto-fallbacks
* [ ] Rate limiter
* [ ] Multi-turn conversation API
* [ ] Local model support (llama.cpp, Ollama)
* [ ] VSCode extension for code-gen

---

## 🛠️ Project Structure (Planned)

```
npm-ai-hooks/
├─ src/
│  ├─ index.js
│  ├─ wrap.js
│  ├─ cache.js
│  ├─ cost.js
│  ├─ errors.js
│  ├─ providers/
│  │   ├─ openai.js
│  │   ├─ claude.js
│  │   ├─ gemini.js
│  │   ├─ deepseek.js
│  │   ├─ groq.js
│  │   └─ index.js
├─ tests/
├─ package.json
├─ README.md
└─ LICENSE
```

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome!
Please open an issue or submit a pull request.

---

## 📜 License

MIT © 2025 `npm-ai-hooks` Team