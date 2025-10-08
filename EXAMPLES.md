7. EXAMPLES.md
# Usage Examples – npm-ai-hooks

## 🧠 In a React Frontend

Install:

```bash
npm install npm-ai-hooks


Example:

import { wrap } from "npm-ai-hooks";

const summarize = wrap((text: string) => text, { task: "summarize" });

export function App() {
  const [result, setResult] = useState("");

  const handleClick = async () => {
    const res = await summarize("Explain server components in React.");
    setResult(res.output);
  };

  return (
    <div>
      <button onClick={handleClick}>Summarize</button>
      <p>{result}</p>
    </div>
  );
}

⚙️ In a Node.js Backend
import { wrap } from "npm-ai-hooks";

const explain = wrap((input: string) => input, { task: "explain" });

app.post("/explain", async (req, res) => {
  const result = await explain(req.body.text);
  res.json(result);
});


This works with Express, NestJS, Fastify, Next.js API routes — anything Node-compatible.


---


---

✅ **With these files in place**, your repository will be structured like a professional, enterprise-ready open-source project: