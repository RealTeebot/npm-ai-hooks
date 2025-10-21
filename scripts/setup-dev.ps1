# Development setup script for npm-ai-hooks
# This script ensures you're using the correct Node.js version and npm configuration

Write-Host "Setting up development environment for npm-ai-hooks..." -ForegroundColor Green

# Check if .nvmrc exists
if (Test-Path ".nvmrc") {
    $nodeVersion = Get-Content ".nvmrc" -Raw
    Write-Host "Found .nvmrc file with Node.js version: $($nodeVersion.Trim())" -ForegroundColor Cyan
    
    # Check if nvm is installed
    try {
        $nvmVersion = nvm version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Using nvm to switch to Node.js version from .nvmrc..." -ForegroundColor Yellow
            nvm use
            if ($LASTEXITCODE -ne 0) {
                Write-Host "Failed to switch to Node.js version. Please install Node.js $($nodeVersion.Trim()) manually." -ForegroundColor Red
            }
        } else {
            Write-Host "nvm not found. Please install nvm or manually install Node.js version $($nodeVersion.Trim())" -ForegroundColor Red
            Write-Host "You can install nvm from: https://github.com/coreybutler/nvm-windows" -ForegroundColor Gray
        }
    } catch {
        Write-Host "nvm not found. Please install nvm or manually install Node.js version $($nodeVersion.Trim())" -ForegroundColor Red
        Write-Host "You can install nvm from: https://github.com/coreybutler/nvm-windows" -ForegroundColor Gray
    }
} else {
    Write-Host ".nvmrc file not found!" -ForegroundColor Red
    exit 1
}

# Check if .npmrc exists
if (Test-Path ".npmrc") {
    Write-Host "Found .npmrc file with npm configuration:" -ForegroundColor Cyan
    Get-Content ".npmrc" | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    Write-Host ""
} else {
    Write-Host ".npmrc file not found!" -ForegroundColor Yellow
}

# Verify Node.js version
Write-Host "Current Node.js version:" -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "   $nodeVersion" -ForegroundColor Gray
} catch {
    Write-Host "   Node.js not found!" -ForegroundColor Red
}

Write-Host "Current npm version:" -ForegroundColor Cyan
try {
    $npmVersion = npm --version
    Write-Host "   $npmVersion" -ForegroundColor Gray
} catch {
    Write-Host "   npm not found!" -ForegroundColor Red
}
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
try {
    npm ci
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

# Run tests
Write-Host "Running tests..." -ForegroundColor Yellow
try {
    npm test
    if ($LASTEXITCODE -eq 0) {
        Write-Host "All tests passed!" -ForegroundColor Green
    } else {
        Write-Host "Some tests failed, but setup is complete." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Failed to run tests, but setup is complete." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  npm test              - Run all tests" -ForegroundColor Gray
Write-Host "  npm run test:watch    - Run tests in watch mode" -ForegroundColor Gray
Write-Host "  npm run test:coverage - Run tests with coverage" -ForegroundColor Gray
Write-Host "  npm run build         - Build the package" -ForegroundColor Gray
Write-Host "  npm run lint          - Run linting" -ForegroundColor Gray
Write-Host "  npm run format        - Format code" -ForegroundColor Gray
Write-Host "  npm run dev           - Run development server" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy coding!" -ForegroundColor Green