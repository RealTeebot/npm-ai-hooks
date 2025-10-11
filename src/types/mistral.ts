export type MistralModel =
  // Premier Models (Latest - Proprietary)
  | "mistral-medium-2508"              // Frontier multimodal model
  | "mistral-medium-latest"            // Alias for latest medium
  | "mistral-large-2411"               // Previous large model
  | "mistral-large-latest"             // Alias (currently points to medium-2508)
  | "pixtral-large-2411"               // Vision-capable large model
  | "pixtral-large-latest"             // Alias for latest pixtral
  | "mistral-small-2407"               // Small premier model
  | "codestral-2508"                   // Code-specialized model
  | "codestral-2501"                   // Previous codestral version
  | "codestral-latest"                 // Alias for latest codestral
  | "devstral-medium-2507"             // Development-focused medium
  | "devstral-medium-latest"           // Alias
  | "ministral-3b-2410"                // Ultra-compact 3B model
  | "ministral-3b-latest"              // Alias
  | "ministral-8b-2410"                // Compact 8B model
  | "ministral-8b-latest"              // Alias
  | "mistral-ocr-2505"                 // OCR-specialized model
  | "mistral-ocr-latest"               // Alias
  
  // Magistral Models (Reasoning)
  | "magistral-medium-2509"            // Medium reasoning model
  | "magistral-medium-latest"          // Alias
  | "magistral-small-2509"             // Small reasoning model with vision
  | "magistral-small-latest"           // Alias
  
  // Open Models (Apache 2.0 License)
  | "mistral-small-2506"               // Open small model (128K context)
  | "mistral-small-2503"               // Previous version
  | "mistral-small-2501"               // Previous version
  | "mistral-small-latest"             // Alias for latest small
  | "devstral-small-2507"              // Open dev model for code
  | "devstral-small-latest"            // Alias
  | "open-mistral-nemo"                // Nemo model (12B)
  | "open-mistral-nemo-2407"           // Specific version
  | "pixtral-12b-2409"                 // Open vision model
  
  // Audio Models
  | "voxtral-small-2507"               // Audio input model
  | "voxtral-small-latest"             // Alias
  | "voxtral-mini-2507"                // Mini audio model
  | "voxtral-mini-latest";             // Alias

/**
 * Default model choice - best balance of performance and cost
 */
export const MistralDefaultModel: MistralModel = "mistral-small-latest";