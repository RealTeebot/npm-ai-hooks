import { initAIHooks, wrap } from "../../src";

// Initialize providers
initAIHooks({
  providers: [
    { provider: 'openai', key: 'sk-your-openai-key-here' },
    { provider: 'claude', key: 'sk-ant-your-claude-key-here' },
    { provider: 'groq', key: 'gsk_your-groq-key-here' }
  ]
});

const summarize = wrap((text: string) => text, { task: "summarize" });

async function run() {
  try {
    const result = await summarize("OpenRouter is a powerful AI integration tool that provides access to multiple AI models through a single API.");
    console.log(result);
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Please set up your API keys in the initAIHooks call');
  }
}

run();
