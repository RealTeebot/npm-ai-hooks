export type PerplexityModel =
  // Sonar Online models (web-grounded responses)
  | "sonar"                          // Standard online search model
  | "sonar-pro"                      // Advanced search with complex queries
  
  // Sonar Reasoning models (step-by-step thinking)
  | "sonar-reasoning"                // Multi-step reasoning with transparent logic
  
  // Sonar Research models (deep analysis)
  | "sonar-research"                 // Comprehensive research and detailed reports
  | "sonar-deep-research";           // In-depth analysis with exhaustive research

/**
 * Default model choice - best balance of speed and accuracy
 */
export const PerplexityDefaultModel: PerplexityModel = "sonar";