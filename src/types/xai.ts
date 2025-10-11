export type XAIModel =
  // Grok 4 family (latest)
  | "grok-code-fast-1"              // Code-optimized, 256K context
  | "grok-4-fast-reasoning"         // Fast reasoning, 2M context
  | "grok-4-fast-non-reasoning"     // Fast non-reasoning, 2M context
  | "grok-4-0709"                   // Standard Grok 4, 256K context
  
  // Grok 3 family
  | "grok-3-mini"                   // Smaller/faster, 131K context
  | "grok-3"                        // Standard Grok 3, 131K context
  
  // Grok 2 family (vision capable)
  | "grok-2-vision-1212"            // Vision model, 32K context
  | "grok-2-1212";                  // Standard Grok 2, 131K context

/**
 * Default model choice - best balance of performance and cost
 */
export const XAIDefaultModel: XAIModel = "grok-4-fast-non-reasoning";