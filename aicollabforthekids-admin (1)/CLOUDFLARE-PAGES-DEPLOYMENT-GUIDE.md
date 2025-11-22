# Cloudflare Pages Deployment Guide
## AI Collab For The Kids - Frontend Dashboard

**Status**: Ready for deployment
**Date**: 2025-11-21
**Mission**: PROJECT LIGHTHOUSE
**Domain**: https://youandinotai.online

---

## ☁️ Cloudflare Pages Deployment Steps

### 1. Access Cloudflare Dashboard

Go to: https://dash.cloudflare.com

- Navigate to: **Workers & Pages**
- Click: **Create Application** → **Pages** → **Connect to Git**

---

### 2. Connect GitHub Repository

1. **Authorize GitHub**: Click "Connect GitHub"
2. **Select Repository**: `Ai-Solutions-Store/GoogleCelladmindashboard`
3. **Configure Build Settings**:

```yaml
Production Branch: main
Build Command: npm run build
Build Output Directory: dist
Root Directory: / (leave empty - build from repo root)
```

---

### 3. Environment Variables (Production)

Click **Add Environment Variables** and add:

**CRITICAL**: These are FRONTEND variables only (embedded in build):

```bash
# Backend API URL (points to Railway)
VITE_API_BASE_URL=https://aicollabforthekids-production.up.railway.app

# Google OAuth (if using Google Sign-In)
VITE_GOOGLE_CLIENT_ID=[YOUR_GOOGLE_OAUTH_CLIENT_ID]
```

**NEVER add backend secrets** like:
- ❌ `GEMINI_API_KEY` (backend only)
- ❌ `SQUARE_ACCESS_TOKEN` (backend only)
- ❌ `DATABASE_URL` (backend only)

All AI/payment requests go through the Railway backend proxy.

---

### 4. Custom Domain Setup

#### Option A: Using Cloudflare DNS (Recommended)

1. In Cloudflare Pages → Your Project → **Custom Domains**
2. Click **Set up a custom domain**
3. Enter: `youandinotai.online`
4. Cloudflare will auto-configure DNS (since domain is already in Cloudflare)

#### Option B: Manual DNS Configuration

Add these records in Cloudflare DNS:

```
Type: CNAME
Name: @ (or youandinotai.online)
Target: [your-project].pages.dev
Proxy: Enabled (Orange Cloud)
```

```
Type: CNAME
Name: www
Target: [your-project].pages.dev
Proxy: Enabled (Orange Cloud)
```

---

### 5. Build & Deploy

1. Click **Save and Deploy**
2. Cloudflare will:
   - Clone the repository
   - Run `npm install`
   - Run `npm run build`
   - Deploy `dist/` folder to global CDN
3. Deployment takes ~2-5 minutes

---

### 6. Verify Deployment

**Test Production URL**:

```bash
# Check if site is live
curl -I https://youandinotai.online

# Expected response:
HTTP/2 200
server: cloudflare
content-type: text/html
```

**Test in Browser**:
1. Navigate to: https://youandinotai.online
2. Open DevTools Console
3. Verify no errors
4. Check API calls go to Railway backend

---

## 🔄 Automatic Deployments

Cloudflare Pages automatically deploys on:
- **Push to `main` branch** → Production deployment
- **Pull Request** → Preview deployment (separate URL)

### Preview Deployments

Each PR gets a unique URL:
```
https://[pr-number].[your-project].pages.dev
```

---

## 🛠️ Build Configuration

### vite.config.ts Settings

Your current config:

```typescript
build: {
  outDir: 'dist',
  sourcemap: false,  // Disabled for production
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'recharts'],
        ai: ['@google/genai'],
      },
    },
  },
}
```

**Result**:
- Optimized bundle size
- Code splitting for faster loads
- No source maps in production

---

## 🔒 Security Headers

Add these in Cloudflare Pages → **Settings** → **Functions** → `_headers` file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://aicollabforthekids-production.up.railway.app;
```

---

## 📊 Performance Optimization

### Cloudflare Features to Enable:

1. **Auto Minify**: HTML, CSS, JS
   - Dashboard → Speed → Optimization → Auto Minify
2. **Brotli Compression**
   - Enabled by default on Cloudflare Pages
3. **HTTP/3 (QUIC)**
   - Dashboard → Network → Enable HTTP/3
4. **Early Hints**
   - Speeds up page loads (beta feature)

---

## 🚨 Troubleshooting

### Build Fails with "Command not found"

**Issue**: Node version mismatch

**Fix**: Add `.nvmrc` or set environment variable:

```bash
NODE_VERSION=20
```

### API Calls Return CORS Error

**Issue**: Backend not allowing Cloudflare domain

**Fix**: Update Railway backend `APP_URL` environment variable:

```bash
APP_URL=https://youandinotai.online
```

### 404 on Direct Route Access (e.g., /dashboard)

**Issue**: SPA routing not configured

**Fix**: Create `public/_redirects` file:

```
/* /index.html 200
```

Or use Cloudflare Pages `_redirects`:

```
/* /index.html 200
```

### Build Time Exceeds 20 Minutes

**Issue**: Large dependencies or slow network

**Fix**:
- Remove unused dependencies
- Enable npm cache in build settings
- Check for network timeouts

---

## 🌐 Cloudflare Analytics

Enable Web Analytics:
1. Dashboard → Analytics & Logs → Web Analytics
2. Add site: `youandinotai.online`
3. View metrics:
   - Page views
   - Unique visitors
   - Geographic distribution
   - Performance metrics (Core Web Vitals)

---

## 🔄 Rollback Strategy

If a deployment breaks:

1. Go to: Cloudflare Pages → Deployments
2. Find last working deployment
3. Click **⋮** (three dots) → **Rollback to this deployment**
4. Deployment instantly reverts

---

## 📈 PROJECT LIGHTHOUSE Integration

Once deployed, verify these features work:

- [ ] Tribute Store UI loads
- [ ] Donation forms submit to Railway backend
- [ ] Flash-Match countdown timer displays
- [ ] Impact tracker shows live metrics
- [ ] Tiny Heroes media displays correctly
- [ ] Payment processing via Square backend

---

## 🚀 Go-Live Checklist

- [ ] Railway backend is healthy (`/health` endpoint returns 200)
- [ ] Cloudflare Pages build succeeds
- [ ] Custom domain `youandinotai.online` resolves correctly
- [ ] HTTPS certificate is active (Cloudflare auto-provisions)
- [ ] API calls from frontend reach Railway backend
- [ ] No console errors in browser
- [ ] All PROJECT LIGHTHOUSE features functional
- [ ] Analytics tracking enabled
- [ ] Error monitoring configured (optional: Sentry)

---

## 📞 Support Resources

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages
- **Cloudflare Community**: https://community.cloudflare.com
- **Vite Deployment Guide**: https://vitejs.dev/guide/static-deploy.html

---

**FOR THE KIDS - ACTIVATE PROJECT LIGHTHOUSE** 🚀
