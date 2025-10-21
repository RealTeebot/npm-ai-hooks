# Contributing to npm-ai-hooks

👋 Thanks for your interest in contributing to **npm-ai-hooks**!  
This project is maintained by the [iTeebot](https://github.com/iTeebot) organization and welcomes community involvement at all levels — from bug fixes and documentation to major feature development.

---

## 🛠️ Development Setup

1. **Fork** the repository and clone your fork:

```bash
git clone https://github.com/your-username/npm-ai-hooks.git
cd npm-ai-hooks

npm install

npm run dev

npm run test

npm-ai-hooks/
├─ src/
│  ├─ index.ts          # Main entry
│  ├─ wrap.ts           # Core hook wrapper logic
│  ├─ cache.ts          # Caching engine
│  ├─ cost.ts           # Cost estimation utilities
│  ├─ errors.ts         # Unified error handling
│  ├─ providers/        # Provider adapters
│  │   ├─ openai.ts
│  │   ├─ claude.ts
│  │   └─ ...
├─ examples/
│  ├─ node-basic/
│  └─ react-basic/
├─ tests/
└─ ...

✨ Contributing Guidelines

TypeScript Only: All code must be written in TypeScript with strict typing enabled.

Linting: Run npm run lint before committing.

Formatting: Code must pass Prettier formatting checks.

Commit Style: Use Conventional Commits
 (e.g., feat: add caching to DeepSeek provider).

Tests: Add unit/integration tests for any new features or bug fixes.

📦 Adding a New Provider

Create a new file in src/providers/ (e.g., mistral.ts)

Implement the required interface:

export const mistralProvider: Provider = {
  name: "mistral",
  isAvailable: () => !!process.env.AI_HOOK_MISTRAL_KEY,
  generate: async (prompt, options) => { /* API call logic */ },
  models: ["mistral-medium", "mistral-large"]
};


Register the provider in providers/index.ts

Add documentation and tests.

🧪 Testing

We use Jest for unit testing and Playwright for integration tests where relevant.

npm run test
npm run test:watch

📣 Communication

Issues: GitHub Issues

Discussions: GitHub Discussions

Pull Requests: Always create a PR to the main branch

🙏 Credits

Maintained with ❤️ by iTeebot
 and contributors.