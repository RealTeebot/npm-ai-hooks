export type DeepSeekModel =
  // DeepSeek Chat (V3-based)
  | "deepseek-chat"           // Points to DeepSeek-V3-0324
  
  // DeepSeek Reasoner (R1-based)
  | "deepseek-reasoner";      // Points to DeepSeek-R1-0528

/**
 * Default model choice
 */
export const DeepSeekDefaultModel: DeepSeekModel = "deepseek-chat";