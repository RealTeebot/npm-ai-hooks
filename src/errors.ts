export class AIHookError extends Error {
    code: string;
    provider?: string;
    suggestion?: string;
  
    constructor(code: string, message: string, provider?: string, suggestion?: string) {
      super(message);
      this.code = code;
      this.provider = provider;
      this.suggestion = suggestion;
    }
  
    pretty() {
      console.error(`\n❌ AI-HOOK ERROR: ${this.message}`);
      if (this.provider) console.error(`   Provider: ${this.provider}`);
      if (this.suggestion) console.error(`   Suggestion: ${this.suggestion}\n`);
    }
  }
  