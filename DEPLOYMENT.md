# Deployment Guide

This guide explains how to deploy the DAO & Kickstarter Dashboard with secure AI delegation.

## Architecture Overview

The application uses a **secure delegation pattern** where:
1. Frontend sends analysis requests to backend
2. Backend makes authenticated calls to Google Gemini API
3. API keys are never exposed to end users

## Development vs Production

### Development Mode
- Frontend makes direct API calls to Gemini
- API key set in `.env.local` (never commit this!)
- Good for local testing and development

### Production Mode
- Frontend calls backend proxy API
- Backend holds the API key securely
- Recommended for all deployed environments

## Step-by-Step Deployment

### 1. Deploy Backend (Required for Production)

#### Option A: Google Cloud Run (Recommended)

1. **Prerequisites:**
   - Google Cloud account with billing enabled
   - `gcloud` CLI installed and authenticated

2. **Deploy:**
   ```bash
   cd backend
   
   # Create secret for API key
   echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
   
   # Deploy to Cloud Run
   gcloud run deploy dao-dashboard-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-secrets=GEMINI_API_KEY=gemini-api-key:latest \
     --set-env-vars FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Save the backend URL** (e.g., `https://dao-dashboard-backend-xxxxx-uc.a.run.app`)

#### Option B: Docker Container

1. **Build the image:**
   ```bash
   cd backend
   docker build -t dao-dashboard-backend .
   ```

2. **Run locally:**
   ```bash
   docker run -p 8080:8080 \
     -e GEMINI_API_KEY=your_key_here \
     -e FRONTEND_URL=http://localhost:3000 \
     dao-dashboard-backend
   ```

3. **Deploy to your container platform:**
   - Push to Docker Hub or Google Container Registry
   - Deploy on your platform (AWS ECS, Azure Container Instances, etc.)

#### Option C: Heroku

```bash
cd backend
heroku create dao-dashboard-backend
heroku config:set GEMINI_API_KEY=your_key_here
heroku config:set FRONTEND_URL=https://your-frontend.herokuapp.com
git push heroku main
```

### 2. Deploy Frontend

#### Option A: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and deploy:**
   ```bash
   # Set environment variable
   export BACKEND_API_URL=https://your-backend-url.com
   
   # Build
   npm run build
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Or use Netlify UI:**
   - Connect your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable: `BACKEND_API_URL=https://your-backend-url.com`

#### Option B: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set environment variable in Vercel dashboard:**
   - Go to Project Settings → Environment Variables
   - Add: `BACKEND_API_URL=https://your-backend-url.com`

#### Option C: GitHub Pages

1. **Update vite.config.ts** for base path:
   ```ts
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   gh-pages -d dist
   ```

3. **Note:** You'll need to set `BACKEND_API_URL` before building

### 3. Update Frontend Configuration

After deploying the backend, update your frontend environment:

**For Netlify/Vercel:**
- Set `BACKEND_API_URL` in the platform's dashboard

**For custom hosting:**
- Create `.env.production` with:
  ```
  BACKEND_API_URL=https://your-backend-url.com
  ```
- Build: `npm run build`
- Deploy the `dist` folder

### 4. Configure CORS

Update your backend's `FRONTEND_URL` to match your frontend domain:

```bash
# Google Cloud Run
gcloud run services update dao-dashboard-backend \
  --update-env-vars FRONTEND_URL=https://your-actual-frontend.com

# Heroku
heroku config:set FRONTEND_URL=https://your-actual-frontend.com

# Docker
# Restart container with new env var
```

### 5. Test Your Deployment

1. **Test backend:**
   ```bash
   curl https://your-backend-url.com/health
   ```
   Should return: `{"status":"healthy",...}`

2. **Test frontend:**
   - Open your frontend URL
   - Navigate to Dashboard
   - Click "Analyze" on any item
   - Verify analysis works

3. **Verify security:**
   - Open browser DevTools → Network
   - Click "Analyze"
   - Verify request goes to backend, not directly to Gemini API
   - Check page source - API key should NOT appear anywhere

## Environment Variables Reference

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `BACKEND_API_URL` | Yes (prod) | Backend API endpoint |
| `API_KEY` | Yes (dev) | Gemini API key (dev only) |

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key |
| `FRONTEND_URL` | Yes (prod) | Your frontend domain |
| `PORT` | No | Server port (default: 8080) |
| `NODE_ENV` | No | Environment (production/development) |

## Security Checklist

Before going to production:

- [ ] Backend is deployed with API key in environment (not code)
- [ ] `FRONTEND_URL` is set to actual domain (not `*`)
- [ ] Rate limiting is enabled on backend
- [ ] Frontend has `BACKEND_API_URL` set
- [ ] `.env.local` is in `.gitignore` (never committed)
- [ ] Verified API key not in frontend bundle (check DevTools)
- [ ] HTTPS enabled on both frontend and backend
- [ ] Error messages don't expose sensitive information

## Monitoring & Maintenance

### Monitor Usage

- **Google Cloud Console:** Check Gemini API usage and costs
- **Backend Logs:** Monitor for errors and rate limit hits
- **Frontend Analytics:** Track user behavior

### Cost Control

1. **Set up billing alerts** in Google Cloud Console
2. **Adjust rate limits** in backend if needed
3. **Consider caching** frequent analysis requests
4. **Use Flash model** for less critical analyses

### Updating

**Frontend updates:**
```bash
git pull
npm install
npm run build
# Deploy via your platform
```

**Backend updates:**
```bash
cd backend
git pull
npm install
# Redeploy via your platform
```

## Troubleshooting

### "Failed to connect to AI service"

- Check backend is running: `curl https://your-backend/health`
- Verify `BACKEND_API_URL` is set correctly in frontend
- Check backend logs for errors

### CORS Errors

- Ensure `FRONTEND_URL` matches your frontend domain exactly
- Include protocol (https://) and no trailing slash
- Check browser console for specific CORS error

### High Costs

- Review Google Cloud billing dashboard
- Reduce `thinkingBudget` in frontend code
- Implement result caching in backend
- Switch to Flash model for less critical requests

### Rate Limit Errors

- Increase rate limits in `backend/server.js`
- Implement user authentication for per-user limits
- Add request queuing in frontend

## Support

For issues:
1. Check [Backend README](./backend/README.md)
2. Review [Main README](./README.md)
3. Check Google Cloud Run logs
4. Open an issue in the repository
