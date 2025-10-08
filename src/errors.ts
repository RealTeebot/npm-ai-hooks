export class AIHookError extends Error {
    code: string;
    provider?: string;
    suggestion?: string;
  
    constructor(code: string, message: string, provider?: string, suggestion?: string) {
      super(message);
      this.code = code;
      this.provider = provider;
      this.suggestion = suggestion;
      // Do NOT print pretty message in constructor
    }
  
    pretty() {
      return `\n❌ AI-HOOK ERROR: ${this.message}` +
        (this.provider ? `\n   Provider: ${this.provider}` : "") +
        (this.suggestion ? `\n   Suggestion: ${this.suggestion}\n` : "");
    }

    toString() {
      return this.pretty();
    }
  }
