@echo off
REM Development setup script for npm-ai-hooks
REM This script ensures you're using the correct Node.js version and npm configuration

echo Setting up development environment for npm-ai-hooks...

REM Check if .nvmrc exists
if exist ".nvmrc" (
    echo Found .nvmrc file with Node.js version:
    type .nvmrc
    echo.
    
    REM Check if nvm is installed
    where nvm >nul 2>nul
    if %errorlevel% == 0 (
        echo Using nvm to switch to Node.js version from .nvmrc...
        nvm use
    ) else (
        echo nvm not found. Please install nvm or manually install Node.js version from .nvmrc
        echo You can install nvm from: https://github.com/coreybutler/nvm-windows
    )
) else (
    echo .nvmrc file not found!
    exit /b 1
)

REM Check if .npmrc exists
if exist ".npmrc" (
    echo Found .npmrc file with npm configuration:
    type .npmrc
    echo.
) else (
    echo .npmrc file not found!
)

REM Verify Node.js version
echo Current Node.js version:
node --version
echo Current npm version:
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
npm ci

REM Run tests
echo Running tests...
npm test

echo Development environment setup complete!
echo.
echo Available commands:
echo   npm test              - Run all tests
echo   npm run test:watch    - Run tests in watch mode
echo   npm run test:coverage - Run tests with coverage
echo   npm run build         - Build the package
echo   npm run lint          - Run linting
echo   npm run format        - Format code
echo   npm run dev           - Run development server