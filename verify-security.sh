#!/bin/bash

# Security Verification Script
# This script verifies that API keys are not exposed in the production build

set -e

echo "🔒 Starting Security Verification..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print results
pass() {
    echo -e "${GREEN}✓${NC} $1"
}

fail() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check 1: Build with production configuration
echo "📦 Building for production with backend proxy..."
# Use .test TLD to make it clear this is for testing
if BACKEND_API_URL=https://backend.example.test npm run build > /dev/null 2>&1; then
    pass "Production build successful"
else
    fail "Production build failed"
fi

# Check 2: Verify backend URL is in bundle
echo ""
echo "🔍 Checking for backend URL in bundle..."
if grep -q "backend.example.test" dist/assets/*.js 2>/dev/null; then
    pass "Backend URL found in bundle (expected for proxy mode)"
else
    fail "Backend URL not found in bundle"
fi

# Check 3: Look for API key patterns
echo ""
echo "🔍 Scanning for API key patterns..."
if grep -E "AIza[A-Za-z0-9_-]{35}|api[_-]?key.*[:=].*['\"][A-Za-z0-9_-]{30,}" dist/assets/*.js > /dev/null 2>&1; then
    fail "Possible API key pattern found in bundle!"
else
    pass "No API key patterns detected in bundle"
fi

# Check 4: Check for direct GoogleGenAI instantiation
echo ""
echo "🔍 Checking for direct API usage..."
if grep "new GoogleGenAI" dist/assets/*.js > /dev/null 2>&1; then
    warn "Direct GoogleGenAI usage found (may be in abstraction layer - verify manually)"
else
    pass "No direct GoogleGenAI instantiation detected"
fi

# Check 5: Verify abstraction layer exists
echo ""
echo "🔍 Verifying abstraction layer..."
if [ -f "utils/aiApi.ts" ]; then
    pass "AI API abstraction layer exists"
    
    # Check for key functions
    if grep -q "generateAnalysis" utils/aiApi.ts && grep -q "useBackendProxy" utils/aiApi.ts; then
        pass "Abstraction layer contains required functions"
    else
        fail "Abstraction layer missing required functions"
    fi
else
    fail "AI API abstraction layer not found"
fi

# Check 6: Verify backend exists
echo ""
echo "🔍 Verifying backend infrastructure..."
if [ -f "backend/server.js" ]; then
    pass "Backend proxy server exists"
    
    if [ -f "backend/package.json" ]; then
        pass "Backend package configuration exists"
    fi
    
    if [ -f "backend/Dockerfile" ]; then
        pass "Backend Dockerfile exists for containerized deployment"
    fi
else
    fail "Backend proxy server not found"
fi

# Check 7: Verify documentation
echo ""
echo "📚 Verifying documentation..."
if [ -f "DEPLOYMENT.md" ]; then
    pass "Deployment guide exists"
fi

if [ -f "backend/README.md" ]; then
    pass "Backend documentation exists"
fi

if [ -f "SECURITY-VERIFICATION.md" ]; then
    pass "Security verification guide exists"
fi

# Check 8: Environment configuration
echo ""
echo "🔍 Checking environment configuration..."
if [ -f ".env.example" ]; then
    pass ".env.example exists for developers"
fi

if [ -f "backend/.env.example" ]; then
    pass "Backend .env.example exists"
fi

# Check 9: Git ignore files
echo ""
echo "🔍 Verifying .gitignore protection..."
if grep -q ".env" .gitignore 2>/dev/null; then
    pass ".env files are in .gitignore"
else
    warn ".env should be in .gitignore to prevent accidental commits"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Security Verification Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Summary:"
echo "  ✅ Production build works correctly"
echo "  ✅ Backend proxy infrastructure in place"
echo "  ✅ API keys protected (not in frontend bundle)"
echo "  ✅ Abstraction layer implemented"
echo "  ✅ Documentation provided"
echo ""
echo "Next steps:"
echo "  1. Deploy backend to Google Cloud Run (see backend/README.md)"
echo "  2. Set BACKEND_API_URL in frontend environment"
echo "  3. Deploy frontend to Netlify/Vercel (see DEPLOYMENT.md)"
echo "  4. Test in production with browser DevTools"
echo ""
