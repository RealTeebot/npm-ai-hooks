import { initAIHooks, wrap } from "../../src";

// Initialize providers
initAIHooks({
  providers: [
    { provider: 'openai', key: 'sk-your-openai-key-here' },
    { provider: 'claude', key: 'sk-ant-your-claude-key-here' }
  ]
});

const sentiment = wrap((text: string) => text, { task: "sentiment" });

async function run() {
  try {
    const result = await sentiment("I love using AI-Hooks for my projects!");
    console.log(result);
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Please set up your API keys in the initAIHooks call');
  }
}

run();
