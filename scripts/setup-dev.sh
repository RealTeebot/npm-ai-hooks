#!/bin/bash

# Development setup script for npm-ai-hooks
# This script ensures you're using the correct Node.js version and npm configuration

echo "Setting up development environment for npm-ai-hooks..."

# Check if .nvmrc exists
if [ -f ".nvmrc" ]; then
    echo "Found .nvmrc file with Node.js version: $(cat .nvmrc)"
    
    # Check if nvm is installed
    if command -v nvm &> /dev/null; then
        echo "Using nvm to switch to Node.js version from .nvmrc..."
        nvm use
    else
        echo "nvm not found. Please install nvm or manually install Node.js version $(cat .nvmrc)"
        echo "You can install nvm from: https://github.com/nvm-sh/nvm"
    fi
else
    echo ".nvmrc file not found!"
    exit 1
fi

# Check if .npmrc exists
if [ -f ".npmrc" ]; then
    echo "Found .npmrc file with npm configuration:"
    cat .npmrc
else
    echo ".npmrc file not found!"
fi

# Verify Node.js version
echo "Current Node.js version: $(node --version)"
echo "Current npm version: $(npm --version)"

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run tests
echo "Running tests..."
npm test

echo "Development environment setup complete!"
echo ""
echo "Available commands:"
echo "  npm test              - Run all tests"
echo "  npm run test:watch    - Run tests in watch mode"
echo "  npm run test:coverage - Run tests with coverage"
echo "  npm run build         - Build the package"
echo "  npm run lint          - Run linting"
echo "  npm run format        - Format code"
echo "  npm run dev           - Run development server"