/**
 * Known OpenAI models (text / reasoning / multimodal) as publicly documented.
 * This list is conservative: use `string` fallback for unknown future models.
 */
export type OpenAIModel =
  // GPT-4.1 family (released April 2025) :contentReference[oaicite:0]{index=0}
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"

  // GPT-4o (multimodal “omni”) family :contentReference[oaicite:1]{index=1}
  | "gpt-4o"
  | "gpt-4o-mini"
  | "chatgpt-4o-latest"

  // O-series reasoning models :contentReference[oaicite:2]{index=2}
  | "o1"
  | "o1-preview"
  | "o1-mini"
  | "o3"
  | "o3-mini"
  | "o3-mini-high"
  | "o4-mini"
  | "o4-mini-high"

  // GPT-4 / turbo / variants (legacy / transitional) :contentReference[oaicite:3]{index=3}
  | "gpt-4"
  | "gpt-4-turbo"
  | "gpt-4-turbo-preview"
  | "gpt-4-0613"
  | "gpt-4-0314"

  // GPT-3.5 / turbo family :contentReference[oaicite:4]{index=4}
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-16k"
  | "gpt-3.5-turbo-0125"
  | "gpt-3.5-turbo-1106"

  // Open-weight (open-source / local) models :contentReference[oaicite:5]{index=5}
  | "gpt-oss-120b"
  | "gpt-oss-20b";

/**
 * Default model choice (you can adjust this).
 */
export const OpenAIDefaultModel: OpenAIModel = "gpt-4.1";