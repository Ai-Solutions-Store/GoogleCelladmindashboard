# Railway Backend Deployment Guide
## AI Collab For The Kids - Production Backend

**Status**: Backend currently offline - requires redeployment
**Date**: 2025-11-21
**Mission**: PROJECT LIGHTHOUSE

---

## 🚂 Railway Deployment Steps

### 1. Access Railway Dashboard

Go to: https://railway.app/dashboard

- Login to your Railway account
- Check if project `aicollabforthekids-production` exists
- If deleted: Create new project

---

### 2. Deploy Backend from GitHub

**Option A: Existing Project (if still exists)**
1. Go to your Railway project
2. Click "Settings" → "Connect Repo"
3. Connect to: `Ai-Solutions-Store/GoogleCelladmindashboard`
4. Set **Root Directory**: `backend`
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `npm start`

**Option B: New Deployment (if project was deleted)**
1. Click "New Project" → "Deploy from GitHub repo"
2. Select: `Ai-Solutions-Store/GoogleCelladmindashboard`
3. Click "Add variables" and configure environment variables (see below)
4. Set **Root Directory**: `backend`
5. Deploy

---

### 3. Configure Environment Variables

In Railway Dashboard → Your Project → Variables, add:

```bash
# Core Settings
NODE_ENV=production
PORT=8080
APP_URL=https://youandinotai.online

# Database (Auto-provided by Railway Postgres Plugin)
DATABASE_URL=${DATABASE_URL}  # This comes from Railway Postgres add-on

# AI Service
GEMINI_API_KEY=${GEMINI_API_KEY}  # From your secure key vault
PROD_GEMINI_API_KEY=${GEMINI_API_KEY}
GEMINI_MODEL=gemini-pro

# Authentication
JWT_SECRET=${JWT_SECRET}  # 32+ character random string

# Payment Processing (Square)
SQUARE_ACCESS_TOKEN=${SQUARE_ACCESS_TOKEN}
SQUARE_LOCATION_ID=${SQUARE_LOCATION_ID}
SQUARE_ENVIRONMENT=production

# Business
BUSINESS_EIN=33-4655313

# Optional: Redis (if using Railway Redis plugin)
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}
```

**IMPORTANT**: Replace `${VARIABLE}` with actual values from your secure vault (NOT from this file).

---

### 4. Add PostgreSQL Database

1. In Railway project, click "New" → "Database" → "Add PostgreSQL"
2. Railway will auto-generate `DATABASE_URL` environment variable
3. Connect to database and run schema initialization:

```bash
# Connect to Railway Postgres (get connection string from Railway dashboard)
psql $DATABASE_URL -f database/schema.sql
psql $DATABASE_URL -f database/init.sql
```

---

### 5. Configure Custom Domain

1. In Railway → Settings → Domains
2. Add custom domain: `api.youandinotai.online` (recommended)
   - OR use Railway-provided domain: `*.up.railway.app`
3. Update DNS in Cloudflare:
   - Add CNAME record: `api` → `[your-railway-domain].up.railway.app`

---

### 6. Verify Deployment

Test backend health:

```bash
# Test Railway domain
curl https://aicollabforthekids-production.up.railway.app/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-11-21T...",
  "uptime": 123.456,
  "database": "connected"
}
```

Test AI endpoint:

```bash
curl -X POST https://aicollabforthekids-production.up.railway.app/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "systemPrompt": "Be helpful"}'
```

---

## 🔧 Troubleshooting

### Backend Returns 404
- **Issue**: Project deleted or not deployed
- **Fix**: Redeploy from GitHub (see Option B above)

### Database Connection Error
- **Issue**: `DATABASE_URL` not set or PostgreSQL plugin missing
- **Fix**: Add PostgreSQL plugin in Railway dashboard

### API Key Errors
- **Issue**: `GEMINI_API_KEY` missing or invalid
- **Fix**: Add environment variable in Railway dashboard with valid key

### CORS Errors from Frontend
- **Issue**: `APP_URL` mismatch
- **Fix**: Set `APP_URL=https://youandinotai.online` in Railway env vars

---

## 📊 Monitoring

Railway provides:
- **Logs**: View in Railway dashboard → Deployments → Logs
- **Metrics**: CPU, Memory, Network usage
- **Alerts**: Set up in Settings → Integrations

---

## 🚀 Next Steps After Backend is Live

1. Update frontend to use Railway backend URL
2. Deploy frontend to Cloudflare Pages
3. Test end-to-end user flows
4. Activate PROJECT LIGHTHOUSE features
5. Monitor donation conversion metrics

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: https://github.com/Ai-Solutions-Store/GoogleCelladmindashboard/issues

---

**FOR THE KIDS** 🚀
