import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { initAIHooks, wrap } from 'npm-ai-hooks'

function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string>('')

  // Initialize AI Hooks with Vite environment variables
  useEffect(() => {
    const providers: Array<{ provider: string; key: string; defaultModel?: string }> = [];

    if (import.meta.env.VITE_OPENAI_KEY) {
      providers.push({
        provider: 'openai',
        key: import.meta.env.VITE_OPENAI_KEY,
        defaultModel: 'gpt-4o'
      });
    }

    if (import.meta.env.VITE_GROQ_KEY) {
      providers.push({
        provider: 'groq',
        key: import.meta.env.VITE_GROQ_KEY,
        defaultModel: 'llama-3.1-70b-versatile'
      });
    }

    if (import.meta.env.VITE_CLAUDE_KEY) {
      providers.push({
        provider: 'claude',
        key: import.meta.env.VITE_CLAUDE_KEY,
        defaultModel: 'claude-3-5-sonnet-20241022'
      });
    }

    if (import.meta.env.VITE_GEMINI_KEY) {
      providers.push({
        provider: 'gemini',
        key: import.meta.env.VITE_GEMINI_KEY,
        defaultModel: 'gemini-1.5-flash'
      });
    }

    if (import.meta.env.VITE_OPENROUTER_KEY) {
      providers.push({
        provider: 'openrouter',
        key: import.meta.env.VITE_OPENROUTER_KEY,
        defaultModel: 'openai/gpt-4o-mini'
      });
    }

    if (providers.length > 0) {
      initAIHooks({
        providers: providers as any,
        defaultProvider: 'groq' as any
      });
      console.log(`✅ Initialized ${providers.length} AI providers for React app`);
      setIsInitialized(true);
    } else {
      console.log('⚠️  No VITE_ API keys found. Please set up your .env file with VITE_ prefixed keys.');
    }
  }, []);

  const handleSummarize = async (provider?: string) => {
    if (!isInitialized) {
      alert('AI providers not initialized. Please check your environment variables.');
      return;
    }

    setLoading(true);
    setSelectedProvider(provider || 'default');
    try {
      const testText = "Isaac Newton was a perfect example of a genius. He was born in 1642 in England and became one of the most influential scientists in history. Newton developed the laws of motion and universal gravitation, which laid the foundation for classical mechanics. He also made significant contributions to mathematics, including the development of calculus. His work on optics led to the understanding of how light behaves and how we see colors. Newton's Principia Mathematica is considered one of the most important scientific works ever written. His discoveries revolutionized our understanding of the physical world and continue to influence science today.";
      
      const summarize = wrap((text: string) => text, { 
        task: "summarize",
        ...(provider && { provider: provider as any })
      });
      
      const result = await summarize(testText);
      setResult(result);
      console.log('Summary result:', result);
    } catch (error) {
      console.error('Summarize error:', error);
      alert('Error: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>AI Hooks + React</h1>
      <div className="card">
        <p>
          Status: {isInitialized ? '✅ AI Providers Ready' : '⚠️ No API Keys Found'}
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Test Different AI Providers:</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <button 
              onClick={() => handleSummarize()} 
              disabled={loading || !isInitialized}
              style={{ padding: '8px 16px', margin: '2px' }}
            >
              {loading && selectedProvider === 'default' ? 'Summarizing...' : 'Default Provider'}
            </button>
            
            <button 
              onClick={() => handleSummarize('openai')} 
              disabled={loading || !isInitialized}
              style={{ padding: '8px 16px', margin: '2px' }}
            >
              {loading && selectedProvider === 'openai' ? 'Summarizing...' : 'OpenAI'}
            </button>
            
            <button 
              onClick={() => handleSummarize('groq')} 
              disabled={loading || !isInitialized}
              style={{ padding: '8px 16px', margin: '2px' }}
            >
              {loading && selectedProvider === 'groq' ? 'Summarizing...' : 'Groq'}
            </button>
            
            <button 
              onClick={() => handleSummarize('claude')} 
              disabled={loading || !isInitialized}
              style={{ padding: '8px 16px', margin: '2px' }}
            >
              {loading && selectedProvider === 'claude' ? 'Summarizing...' : 'Claude'}
            </button>
            
            <button 
              onClick={() => handleSummarize('gemini')} 
              disabled={loading || !isInitialized}
              style={{ padding: '8px 16px', margin: '2px' }}
            >
              {loading && selectedProvider === 'gemini' ? 'Summarizing...' : 'Gemini'}
            </button>
            
            <button 
              onClick={() => handleSummarize('openrouter')} 
              disabled={loading || !isInitialized}
              style={{ padding: '8px 16px', margin: '2px' }}
            >
              {loading && selectedProvider === 'openrouter' ? 'Summarizing...' : 'OpenRouter'}
            </button>
          </div>
        </div>

        {result && (
          <div style={{ marginTop: '20px', textAlign: 'left', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
            <h3>Summary Result ({selectedProvider}):</h3>
            <p><strong>Output:</strong> {result.output}</p>
            <p><strong>Provider:</strong> {result.meta?.provider}</p>
            <p><strong>Model:</strong> {result.meta?.model}</p>
            <p><strong>Latency:</strong> {result.meta?.latencyMs}ms</p>
            <p><strong>Cost:</strong> ${result.meta?.estimatedCostUSD || 0}</p>
          </div>
        )}
      </div>
      <p className="read-the-docs">
        Set up VITE_ prefixed environment variables for API keys
      </p>
    </>
  )
}

export default App
