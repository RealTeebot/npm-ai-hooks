export type ClaudeModel =
  // Claude 4 family (latest - released May 2025)
  | "claude-opus-4-20250514"
  | "claude-opus-4-0"                    // Alias for latest Opus 4
  | "claude-sonnet-4-20250514"
  | "claude-sonnet-4-0"                  // Alias for latest Sonnet 4
  
  // Claude 3.7 family
  | "claude-3-7-sonnet-20250219"
  | "claude-3-7-sonnet-latest"           // Alias
  
  // Claude 3.5 family
  | "claude-3-5-sonnet-20241022"         // v2
  | "claude-3-5-sonnet-20240620"         // v1
  | "claude-3-5-sonnet-latest"           // Alias for latest 3.5
  | "claude-3-5-haiku-20241022"
  | "claude-3-5-haiku-latest"            // Alias
  
  // Claude 3 family (legacy)
  | "claude-3-haiku-20240307";

/**
 * Default model choice - best balance of performance and cost
 */
export const ClaudeDefaultModel: ClaudeModel = "claude-sonnet-4-20250514";