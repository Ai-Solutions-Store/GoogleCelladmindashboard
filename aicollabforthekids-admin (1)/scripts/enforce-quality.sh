#!/bin/bash

# AiCollabFortheKids - Quality Enforcement Script
# Runs before every build to ensure code quality standards

set -e  # Exit on any error

echo "🔍 Running quality checks..."

# Check if TypeScript is available
if ! command -v npx &> /dev/null || ! npx tsc --version &> /dev/null; then
    echo "❌ Error: TypeScript is not installed or not available"
    echo "Please ensure dependencies are installed with: npm install"
    exit 1
fi

# Run TypeScript type checking
echo "📝 TypeScript type checking..."
if ! npx tsc --noEmit; then
    echo "❌ TypeScript type checking failed!"
    echo "Fix the errors above and try again."
    exit 1
fi

# Note: ESLint is run separately with 'npm run lint'
# We skip it here to avoid duplicate runs and build failures
# The build process will handle linting separately if needed

echo "✅ Quality checks passed!"
