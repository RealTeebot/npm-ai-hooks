export type GeminiModel =
  // Gemini 2.5 family (latest and most powerful)
  | "gemini-2.5-pro"                    // Most powerful thinking model
  | "gemini-2.5-flash"                  // Best price-performance
  | "gemini-2.5-flash-lite"             // Optimized for cost-efficiency
  
  // Gemini 2.0 family
  | "gemini-2.0-flash"                  // Next-gen with improved speed
  | "gemini-2.0-flash-exp"              // Experimental version
  | "gemini-2.0-flash-001"              // Stable version
  | "gemini-2.0-flash-lite"             // Cost-efficient variant
  | "gemini-2.0-flash-lite-001"         // Stable version
  
  // Gemini 1.5 family (deprecated but still available)
  | "gemini-1.5-pro"                    // Mid-size multimodal
  | "gemini-1.5-pro-001"                // Stable version
  | "gemini-1.5-pro-002"                // Stable version
  | "gemini-1.5-pro-latest"             // Latest stable
  | "gemini-1.5-flash"                  // Fast and versatile
  | "gemini-1.5-flash-001"              // Stable version
  | "gemini-1.5-flash-002"              // Stable version
  | "gemini-1.5-flash-latest"           // Latest stable
  | "gemini-1.5-flash-8b"               // Small model (deprecated)
  | "gemini-1.5-flash-8b-001"           // Stable version
  | "gemini-1.5-flash-8b-latest";       // Latest stable

/**
 * Default model choice - best price-performance ratio
 */
export const GeminiDefaultModel: GeminiModel = "gemini-2.5-flash";