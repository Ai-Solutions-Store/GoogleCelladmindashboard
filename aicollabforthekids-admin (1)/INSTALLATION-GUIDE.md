# AiCollabFortheKids - Installation Guide

## 🚀 Quick Start with Master Installation Script

The **master-install.ps1** PowerShell script automates the complete installation and build process for the AiCollabFortheKids admin dashboard.

### Prerequisites

Before running the installation script, ensure you have:

1. **Node.js v20 or higher** - [Download from nodejs.org](https://nodejs.org)
2. **npm** (comes with Node.js)
3. **PowerShell** (Windows) or **PowerShell Core** (macOS/Linux)
4. **Git** (optional, for version control)

### Verify Prerequisites

```powershell
# Check Node.js version
node -v
# Should show v20.x.x or higher

# Check npm version
npm -v
# Should show 10.x.x or higher
```

## 📋 Installation Steps

### Option 1: Run Master Install Script (Recommended)

1. **Open PowerShell** in the project directory
2. **Run the master installation script:**

```powershell
.\master-install.ps1
```

The script will automatically:
- ✅ Validate your environment (Node.js, npm, Git)
- ✅ Clean previous installations
- ✅ Install all dependencies with `--legacy-peer-deps` flag
- ✅ Run quality checks (TypeScript type checking)
- ✅ Build the production bundle
- ✅ Create deployment checklist
- ✅ Generate installation log

### Option 2: Manual Installation

If you prefer to run steps manually or the script fails:

1. **Clean previous installation:**
```bash
rm -rf node_modules package-lock.json dist
```

2. **Install dependencies:**
```bash
npm install --legacy-peer-deps
```

3. **Run quality checks:**
```bash
npm run quality
# or manually:
npx tsc --noEmit
```

4. **Build the application:**
```bash
npm run build
```

## 🔧 Troubleshooting

### Build Fails with TypeScript Errors

If the build fails with TypeScript errors, run type checking separately:

```bash
npx tsc --noEmit
```

This will show all TypeScript errors that need to be fixed.

### Build Fails with ESLint Errors

If the build fails with linting errors, check them with:

```bash
npm run lint
```

The project uses strict linting with `--max-warnings 0`, meaning any warnings will fail the build.

### npm install Fails

Try these steps:

1. **Clear npm cache:**
```bash
npm cache clean --force
```

2. **Delete node_modules and try again:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

3. **Check internet connection** - Dependencies need to be downloaded from npm registry

### Script Execution Policy Error (Windows)

If you get an error about script execution policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run the installation script again.

## 📦 What Gets Installed

The installation process installs:

### Production Dependencies
- **React 18.2.0** - UI framework
- **React DOM 18.2.0** - React renderer
- **@google/genai** - Google Gemini AI SDK
- **lucide-react** - Icon library
- **react-markdown** - Markdown rendering
- **recharts** - Data visualization

### Development Dependencies
- **TypeScript 5.2.2** - Type system
- **Vite 5.1.6** - Build tool
- **ESLint** - Code linting
- **Tailwind CSS** - Styling framework
- **@vitejs/plugin-react** - React integration

## 🏗️ Build Output

After successful installation and build:

- **Build directory:** `dist/`
- **Build size:** Approximately 1-1.5 MB (gzipped)
- **Output files:**
  - `dist/index.html` - Main HTML file
  - `dist/assets/` - JavaScript and CSS bundles
  - `dist/manifest.json` - PWA manifest

## 📝 Post-Installation

After successful installation, you'll find these files:

1. **DEPLOYMENT-CHECKLIST.md** - Step-by-step deployment guide
2. **INSTALLATION.log** - Installation details and timestamp
3. **dist/** - Production-ready build

## 🧪 Testing Locally

Before deploying, test the application locally:

```bash
npm run dev
```

Then open your browser to:
```
http://localhost:5173
```

## 🚀 Deployment

See **DEPLOYMENT-CHECKLIST.md** for complete deployment instructions.

Quick summary:
1. Upload `dist/` folder contents to your hosting provider
2. Configure Google OAuth redirect URIs
3. Set up environment variables on the server
4. Enable HTTPS/SSL
5. Test production deployment

## 🔐 Environment Variables

The application requires these environment variables:

- `GEMINI_API_KEY` - Google Gemini API key
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `SQUARE_ACCESS_TOKEN` - Square payment integration (optional)
- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment mode (production/development)

See **SECRETS-INVENTORY.md** for complete environment variable documentation.

## 📞 Support

- **Repository:** [Ai-Solutions-Store/GoogleCelladmindashboard](https://github.com/Ai-Solutions-Store/GoogleCelladmindashboard)
- **Documentation:** See DEPLOYMENT-SUMMARY.md
- **Issues:** [GitHub Issues](https://github.com/Ai-Solutions-Store/GoogleCelladmindashboard/issues)
- **Owner:** Joshua Coleman (joshlcoleman@gmail.com)

## 💖 Mission

**"For The Kids!"**

50% of profits go to Shriners Children's Hospitals

---

*Generated for AiCollabFortheKids v2.1.0*
*Last Updated: November 21, 2024*
