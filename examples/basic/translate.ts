import { initAIHooks, wrap } from "../../src";

// Initialize providers
initAIHooks({
  providers: [
    { provider: 'openai', key: 'sk-your-openai-key-here' },
    { provider: 'claude', key: 'sk-ant-your-claude-key-here' }
  ]
});

const translate = wrap((text: string) => text, { task: "translate", targetLanguage: "Urdu" });

async function run() {
  try {
    const result = await translate("Hello everyone! Welcome to AI demos.");
    console.log(result);
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Please set up your API keys in the initAIHooks call');
  }
}

run();
