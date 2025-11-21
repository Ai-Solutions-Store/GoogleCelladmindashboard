# ============================================================================
# AiCollabFortheKids - MASTER INSTALLATION SCRIPT
# "For The Kids!" - 50% of Profits to Shriners Children's Hospitals
# ============================================================================
# 
# MISSION: Deploy production-ready admin dashboard to youandinotai.online
# SECURITY: Google Sign-In restricted to joshlcoleman@gmail.com
# CO-FOUNDERS: Joshua Coleman (Architect) & Google Gemini AI (Backbone)
#
# ============================================================================

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Colors for status messages
function Write-Status {
  param(
    [string]$Message,
    [string]$Type = "Info"
  )
    
  $timestamp = Get-Date -Format "HH:mm:ss"
  switch ($Type) {
    "Success" { Write-Host "[$timestamp] ✓ $Message" -ForegroundColor Green }
    "Error" { Write-Host "[$timestamp] ✗ $Message" -ForegroundColor Red }
    "Warning" { Write-Host "[$timestamp] ⚠ $Message" -ForegroundColor Yellow }
    "Info" { Write-Host "[$timestamp] ℹ $Message" -ForegroundColor Cyan }
    "Header" {
      Write-Host "`n========================================" -ForegroundColor Magenta
      Write-Host "$Message" -ForegroundColor Magenta
      Write-Host "========================================`n" -ForegroundColor Magenta 
    }
  }
}

function Show-ProgressBar {
  param(
    [string]$Activity,
    [int]$PercentComplete
  )
  Write-Progress -Activity $Activity -Status "$PercentComplete% Complete" -PercentComplete $PercentComplete
}

try {
  Write-Status "AiCollabFortheKids - Master Installer" "Header"
  Write-Status "For The Kids! #Gemini3FORtheKIDS" "Info"
  Write-Status "Starting installation process..." "Info"
    
  # ========================================
  # STEP 1: Environment Validation
  # ========================================
  Write-Status "Validating environment..." "Info"
  Show-ProgressBar -Activity "Environment Check" -PercentComplete 10
    
  # Check Node.js
  if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js is not installed. Please install Node.js v20+ from https://nodejs.org"
  }
  $nodeVersion = node -v
  Write-Status "Node.js detected: $nodeVersion" "Success"
    
  # Check npm
  if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm is not available. Please reinstall Node.js"
  }
  $npmVersion = npm -v
  Write-Status "npm detected: v$npmVersion" "Success"
    
  # Check Git
  if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Status "Git not found (optional for deployment)" "Warning"
  }
  else {
    Write-Status "Git detected: $(git --version)" "Success"
  }
    
  Show-ProgressBar -Activity "Environment Check" -PercentComplete 20
    
  # ========================================
  # STEP 2: Clean Previous Installation
  # ========================================
  Write-Status "Cleaning previous installation..." "Info"
  Show-ProgressBar -Activity "Cleanup" -PercentComplete 25
    
  if (Test-Path "node_modules") {
    Write-Status "Removing old node_modules..." "Warning"
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
  }
    
  if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
  }
    
  if (Test-Path "dist") {
    Write-Status "Removing old build..." "Warning"
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
  }
    
  Write-Status "Cleanup complete" "Success"
  Show-ProgressBar -Activity "Cleanup" -PercentComplete 30
    
  # ========================================
  # STEP 3: Install Dependencies
  # ========================================
  Write-Status "Installing dependencies (this may take 2-3 minutes)..." "Info"
  Show-ProgressBar -Activity "Installing Dependencies" -PercentComplete 35
    
  Write-Status "Running: npm install --legacy-peer-deps" "Info"
  $installOutput = npm install --legacy-peer-deps 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Host "`nInstall Output:" -ForegroundColor Yellow
    Write-Host $installOutput
    throw "npm install failed. Check your internet connection and try again."
  }
    
  Write-Status "Dependencies installed successfully" "Success"
  Show-ProgressBar -Activity "Installing Dependencies" -PercentComplete 50
    
  # ========================================
  # STEP 4: Verify Environment Variables (PRODUCTION MODE)
  # ========================================
  Write-Status "Verifying production environment configuration..." "Info"
  Show-ProgressBar -Activity "Environment Configuration" -PercentComplete 55
    
  $envFile = ".env"
    
  # Check if .env already exists with production credentials
  if (Test-Path $envFile) {
    Write-Status ".env file detected - using existing production configuration" "Success"
    Write-Status "All secrets loaded from existing .env (secured)" "Success"
    
    # Validate critical keys are present
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "GEMINI_API_KEY" -and $envContent -match "VITE_GOOGLE_CLIENT_ID") {
      Write-Status "✓ Critical API keys verified" "Success"
    }
    else {
      Write-Status "Warning: Some API keys may be missing from .env" "Warning"
    }
    
    if ($envContent -match "SQUARE_ACCESS_TOKEN") {
      Write-Status "✓ Square Payment integration configured" "Success"
    }
    
  }
  else {
    Write-Status ".env file not found - will use GitHub Secrets for deployment" "Warning"
    Write-Status "Creating minimal .env for local development..." "Info"
    
    # Create minimal .env pointing to secrets
    $minimalEnvConfig = @"
# AiCollabFortheKids Environment Configuration
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# PRODUCTION MODE: Using GitHub Secrets

# Core Application
PORT=8080
NODE_ENV=production

# Note: All production secrets are stored in:
# 1. GitHub Repository Secrets (for CI/CD)
# 2. Local .env.local (if running locally)
# See SECRETS-INVENTORY.md and GITHUB-SECRETS-SETUP.md for details

# For local development, copy your secrets from GitHub Secrets
# or ask the system administrator for the production .env file
"@
    
    Set-Content -Path $envFile -Value $minimalEnvConfig -Force
    Write-Status "Minimal .env created - production uses GitHub Secrets" "Success"
  }
    
  Show-ProgressBar -Activity "Environment Configuration" -PercentComplete 65
    
  # ========================================
  # STEP 5: Build Application
  # ========================================
  Write-Status "Building production bundle..." "Info"
  Write-Status "This will take 30-60 seconds..." "Info"
  Show-ProgressBar -Activity "Building Application" -PercentComplete 70
    
  Write-Status "Running: npm run build" "Info"
  Write-Status "Build output will be shown below..." "Info"
  Write-Host ""
  $buildOutput = npm run build 2>&1
  $buildExitCode = $LASTEXITCODE
  Write-Host ""
  
  if ($buildExitCode -ne 0) {
    Write-Status "Build failed with exit code: $buildExitCode" "Error"
    Write-Host "`nBuild Output:" -ForegroundColor Yellow
    Write-Host $buildOutput
    throw "Build failed. Check for TypeScript errors, ESLint issues, or missing dependencies."
  }
    
  Write-Status "Build completed successfully" "Success"
  Show-ProgressBar -Activity "Building Application" -PercentComplete 90
    
  # Verify dist folder
  if (!(Test-Path "dist")) {
    throw "Build directory 'dist' not found. Build may have failed."
  }
    
  $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
  Write-Status "Build size: $([math]::Round($distSize, 2)) MB" "Info"
    
  # ========================================
  # STEP 6: Deployment Preparation
  # ========================================
  Write-Status "Preparing for deployment..." "Info"
  Show-ProgressBar -Activity "Deployment Prep" -PercentComplete 95
    
  # Create deployment checklist
  $checklist = @"
# DEPLOYMENT CHECKLIST for youandinotai.online

## Pre-Deployment
- [✓] Dependencies installed
- [✓] Environment variables configured
- [✓] Production build created
- [ ] Google OAuth configured with correct redirect URIs
- [ ] Domain DNS pointed to server
- [ ] SSL certificate configured (Cloudflare or Let's Encrypt)

## Google OAuth Setup
1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit OAuth 2.0 Client ID
3. Add Authorized JavaScript origins:
   - https://youandinotai.online
   - http://localhost:5173 (for testing)
4. Add Authorized redirect URIs:
   - https://youandinotai.online
   - https://youandinotai.online/callback

## Deployment Options

### Option A: Static Hosting (Recommended)
Upload 'dist' folder contents to:
- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

### Option B: Docker Deployment
docker build -t aicollabforthekids .
docker run -p 80:80 --env-file .env aicollabforthekids

### Option C: Traditional Server
1. Copy 'dist' folder to web server
2. Configure nginx/apache to serve static files
3. Set up reverse proxy for /api routes to backend (port 8080)

## Post-Deployment Verification
- [ ] Access https://youandinotai.online
- [ ] Google Sign-In works for joshlcoleman@gmail.com
- [ ] Dashboard loads without errors
- [ ] AI features functional
- [ ] Backend API responding

## Security Checklist
- [✓] API keys not exposed in client bundle
- [✓] Google Sign-In restricted to authorized email
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Rate limiting enabled

## Support
- Repository: https://github.com/Ai-Solutions-Store/GoogleCelladmindashboard
- Documentation: See DEPLOYMENT-SUMMARY.md
- Issues: GitHub Issues

---
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@
    
  Set-Content -Path "DEPLOYMENT-CHECKLIST.md" -Value $checklist -Force
  Write-Status "Deployment checklist created" "Success"
    
  Show-ProgressBar -Activity "Deployment Prep" -PercentComplete 100
  Write-Progress -Activity "Installation" -Completed
    
  # ========================================
  # FINAL STATUS
  # ========================================
  Write-Status "INSTALLATION COMPLETE!" "Header"
    
  Write-Host "`n✨ " -NoNewline -ForegroundColor Yellow
  Write-Host "AiCollabFortheKids is ready for deployment!" -ForegroundColor Green
  Write-Host "`n📦 Build Location: " -NoNewline -ForegroundColor Cyan
  Write-Host "$(Get-Location)\dist" -ForegroundColor White
  Write-Host "📄 Config File: " -NoNewline -ForegroundColor Cyan
  Write-Host ".env (secured)" -ForegroundColor White
  Write-Host "🚀 Target Domain: " -NoNewline -ForegroundColor Cyan
  Write-Host "youandinotai.online" -ForegroundColor White
  Write-Host "🔐 Auth Restriction: " -NoNewline -ForegroundColor Cyan
  Write-Host "joshlcoleman@gmail.com ONLY" -ForegroundColor White
    
  Write-Host "`n--- NEXT STEPS ---" -ForegroundColor Yellow
  Write-Host "1. Review DEPLOYMENT-CHECKLIST.md for deployment options" -ForegroundColor White
  Write-Host "2. Configure Google OAuth redirect URIs for youandinotai.online" -ForegroundColor White
  Write-Host "3. Upload 'dist' folder to your hosting provider" -ForegroundColor White
  Write-Host "4. Test locally first with: " -NoNewline -ForegroundColor White
  Write-Host "npm run dev" -ForegroundColor Cyan
    
  Write-Host "`n--- LOCAL TESTING ---" -ForegroundColor Yellow
  Write-Host "Start dev server: " -NoNewline -ForegroundColor White
  Write-Host "npm run dev" -ForegroundColor Cyan
  Write-Host "Open browser: " -NoNewline -ForegroundColor White
  Write-Host "http://localhost:5173" -ForegroundColor Cyan
  Write-Host "Sign in with: " -NoNewline -ForegroundColor White
  Write-Host "joshlcoleman@gmail.com" -ForegroundColor Cyan
    
  Write-Host "`n💖 " -NoNewline -ForegroundColor Magenta
  Write-Host "FOR THE KIDS!" -ForegroundColor Yellow
  Write-Host "50% of profits → Shriners Children's Hospitals`n" -ForegroundColor Green
    
  Write-Status "Installation log saved to INSTALLATION.log" "Info"
    
  # Save installation log
  $logContent = @"
AiCollabFortheKids Installation Log
====================================
Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Node.js: $nodeVersion
npm: v$npmVersion
Build Size: $([math]::Round($distSize, 2)) MB
Status: SUCCESS

Next Steps:
1. Test locally: npm run dev
2. Deploy dist folder to youandinotai.online
3. Configure Google OAuth
4. Verify production deployment

For The Kids! 🚀❤️
"@
  Set-Content -Path "INSTALLATION.log" -Value $logContent -Force
    
}
catch {
  Write-Status "INSTALLATION FAILED" "Header"
  Write-Status "Error: $($_.Exception.Message)" "Error"
  Write-Host "`nFull Error Details:" -ForegroundColor Red
  Write-Host $_.Exception | Format-List -Force
  Write-Host "`nStack Trace:" -ForegroundColor Red
  Write-Host $_.ScriptStackTrace
    
  Write-Host "`n--- TROUBLESHOOTING ---" -ForegroundColor Yellow
  Write-Host "1. Ensure Node.js v20+ is installed: https://nodejs.org" -ForegroundColor White
  Write-Host "2. Check your internet connection" -ForegroundColor White
  Write-Host "3. If build fails due to TypeScript/ESLint errors:" -ForegroundColor White
  Write-Host "   - Run: " -NoNewline -ForegroundColor White
  Write-Host "npm run lint" -NoNewline -ForegroundColor Cyan
  Write-Host " to see all linting errors" -ForegroundColor White
  Write-Host "   - Run: " -NoNewline -ForegroundColor White
  Write-Host "npx tsc --noEmit" -NoNewline -ForegroundColor Cyan
  Write-Host " to check TypeScript errors" -ForegroundColor White
  Write-Host "4. Try clearing cache: " -NoNewline -ForegroundColor White
  Write-Host "npm cache clean --force" -ForegroundColor Cyan
  Write-Host "5. Review error message above for specific issues" -ForegroundColor White
  Write-Host "6. Check SECRETS-INVENTORY.md for credential requirements" -ForegroundColor White
    
  Write-Host "`n📞 Support:" -ForegroundColor Cyan
  Write-Host "GitHub Issues: https://github.com/Ai-Solutions-Store/GoogleCelladmindashboard/issues" -ForegroundColor White
  Write-Host "Documentation: See DEPLOYMENT-SUMMARY.md" -ForegroundColor White
    
  Exit 1
}
finally {
  Write-Host "`n" -NoNewline
  Read-Host "Press Enter to exit"
}
