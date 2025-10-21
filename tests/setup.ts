// Test setup file
import * as dotenv from "dotenv";
import { initAIHooks, reset } from "../src/providers";

// Load environment variables from .env file for testing
dotenv.config();

// Set test environment
process.env.NODE_ENV = "test";

// Helper function to initialize providers from environment variables
export function initializeProvidersFromEnv() {
  reset(); // Reset any existing providers
  
  const providers: Array<{ provider: string; key: string }> = [];
  
  // Check for each provider's API key in environment
  if (process.env.AI_HOOK_OPENAI_KEY) {
    providers.push({ provider: 'openai', key: process.env.AI_HOOK_OPENAI_KEY });
  }
  if (process.env.AI_HOOK_CLAUDE_KEY) {
    providers.push({ provider: 'claude', key: process.env.AI_HOOK_CLAUDE_KEY });
  }
  if (process.env.AI_HOOK_GEMINI_KEY) {
    providers.push({ provider: 'gemini', key: process.env.AI_HOOK_GEMINI_KEY });
  }
  if (process.env.AI_HOOK_GROQ_KEY) {
    providers.push({ provider: 'groq', key: process.env.AI_HOOK_GROQ_KEY });
  }
  if (process.env.AI_HOOK_OPENROUTER_KEY) {
    providers.push({ provider: 'openrouter', key: process.env.AI_HOOK_OPENROUTER_KEY });
  }
  if (process.env.AI_HOOK_DEEPSEEK_KEY) {
    providers.push({ provider: 'deepseek', key: process.env.AI_HOOK_DEEPSEEK_KEY });
  }
  if (process.env.AI_HOOK_XAI_KEY) {
    providers.push({ provider: 'xai', key: process.env.AI_HOOK_XAI_KEY });
  }
  if (process.env.AI_HOOK_PERPLEXITY_KEY) {
    providers.push({ provider: 'perplexity', key: process.env.AI_HOOK_PERPLEXITY_KEY });
  }
  if (process.env.AI_HOOK_MISTRAL_KEY) {
    providers.push({ provider: 'mistral', key: process.env.AI_HOOK_MISTRAL_KEY });
  }
  
  if (providers.length > 0) {
    initAIHooks({
      providers: providers as any, // Type assertion for compatibility
      defaultProvider: process.env.AI_HOOK_DEFAULT_PROVIDER as any
    });
    return true;
  }
  
  return false;
}

// Helper function to check if any providers are available
export function hasProvidersAvailable(): boolean {
  return !!(process.env.AI_HOOK_OPENAI_KEY || 
           process.env.AI_HOOK_CLAUDE_KEY || 
           process.env.AI_HOOK_GEMINI_KEY || 
           process.env.AI_HOOK_GROQ_KEY || 
           process.env.AI_HOOK_OPENROUTER_KEY || 
           process.env.AI_HOOK_DEEPSEEK_KEY || 
           process.env.AI_HOOK_XAI_KEY || 
           process.env.AI_HOOK_PERPLEXITY_KEY || 
           process.env.AI_HOOK_MISTRAL_KEY);
}

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to reduce noise during testing
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress console output during tests unless explicitly enabled
  if (!process.env.TEST_VERBOSE) {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  }
});

afterAll(() => {
  // Restore console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Test timeout for API calls
jest.setTimeout(30000);

// Test utilities
export const TEST_TIMEOUT = 30000;
export const MOCK_RESPONSE = "This is a mock AI response for testing purposes.";

// Test data
export const TEST_INPUTS = {
  short: "Hello world",
  medium: "This is a medium length text that should be processed by the AI system for testing purposes.",
  long: "This is a much longer text that contains multiple sentences and should provide a good test case for the AI processing capabilities. It includes various types of content and should be comprehensive enough to test the summarization, translation, and other AI tasks effectively. The text should be long enough to trigger different behaviors in the AI models and provide meaningful test results.",
  code: `function calculateSum(a: number, b: number): number {
  return a + b;
}

const result = calculateSum(5, 10);
console.log(result);`,
  html: "<div><h1>Test Title</h1><p>This is a test paragraph with <strong>bold</strong> text.</p></div>",
  json: '{"name": "test", "value": 123, "nested": {"key": "value"}}'
};

// Expected outputs for different tasks
export const EXPECTED_OUTPUTS = {
  summarize: {
    short: "Hello world",
    medium: "Medium length text about AI system testing.",
    long: "Long text about AI processing capabilities and testing."
  },
  translate: {
    short: "Hola mundo",
    medium: "Este es un texto de longitud media que debería ser procesado por el sistema de IA para propósitos de prueba."
  },
  explain: {
    code: "This function calculates the sum of two numbers and returns the result."
  },
  sentiment: {
    positive: "positive",
    negative: "negative",
    neutral: "neutral"
  }
};
