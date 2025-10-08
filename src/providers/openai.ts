import axios from "axios";

export async function callOpenAI(prompt: string, model: string) {
  const key = process.env.AI_HOOK_OPENAI_KEY;
  if (!key) throw new Error("Missing AI_HOOK_OPENAI_KEY");

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model,
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: { Authorization: `Bearer ${key}` }
    }
  );

  return response.data.choices[0].message.content;
}
