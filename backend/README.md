# Backend Proxy Server

This is a secure backend proxy server that handles AI API calls, preventing API key exposure in the frontend.

## Why Use a Backend Proxy?

**Security**: API keys should never be exposed in frontend JavaScript bundles. Anyone with access to your frontend code can extract and abuse your API key.

**Control**: A backend proxy gives you:
- Rate limiting to prevent abuse
- Request logging and monitoring
- Cost control and usage tracking
- Additional security layers

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. **Run the server:**
   ```bash
   npm run dev
   ```

4. **Test the server:**
   ```bash
   curl http://localhost:8080/health
   ```

### Production Deployment

#### Deploy to Google Cloud Run

1. **Create a project and enable billing** in Google Cloud Console

2. **Install gcloud CLI** (if not already installed)

3. **Authenticate:**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

4. **Create a secret for your API key:**
   ```bash
   echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
   ```

5. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy ai-proxy \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-secrets=GEMINI_API_KEY=gemini-api-key:latest \
     --set-env-vars FRONTEND_URL=https://your-frontend-domain.com
   ```

6. **Get your backend URL:**
   The deployment will output a URL like: `https://ai-proxy-xxxxx-uc.a.run.app`

7. **Update your frontend:**
   Set `BACKEND_API_URL` environment variable in your frontend to the Cloud Run URL.

#### Deploy to Other Platforms

**AWS Lambda / Elastic Beanstalk:**
- Package the application
- Set environment variables in AWS Console
- Deploy using AWS CLI or Console

**Heroku:**
```bash
heroku create your-app-name
heroku config:set GEMINI_API_KEY=your_key_here
heroku config:set FRONTEND_URL=https://your-frontend.com
git push heroku main
```

**DigitalOcean App Platform:**
- Connect your repository
- Set environment variables in the UI
- Deploy

## API Endpoints

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "ai-proxy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### `POST /api/ai/analyze`
Generate AI analysis.

**Request:**
```json
{
  "prompt": "Analyze the following data...",
  "model": "gemini-2.5-pro",
  "thinkingBudget": 32768
}
```

**Response:**
```json
{
  "text": "Analysis result...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes | - | Your Google Gemini API key |
| `PORT` | No | 8080 | Server port |
| `FRONTEND_URL` | Yes (prod) | * | Frontend domain for CORS |
| `NODE_ENV` | No | production | Environment mode |

## Security Features

- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Cross-origin protection
- ✅ **Rate Limiting** - Prevents abuse (100 requests per 15 minutes per IP)
- ✅ **Input Validation** - Validates all inputs
- ✅ **Error Handling** - Doesn't expose internal details

## Monitoring & Logging

The server logs:
- All analysis requests (without sensitive data)
- Errors and failures
- Health check requests

For production, consider adding:
- Cloud logging (Stackdriver, CloudWatch, etc.)
- Error tracking (Sentry, Rollbar)
- Performance monitoring (New Relic, DataDog)

## Cost Considerations

Each AI analysis request costs based on:
- Model used (gemini-2.5-pro is more expensive than flash)
- Input/output token count
- Thinking budget (higher = more expensive)

Monitor your usage in the Google Cloud Console.

## Troubleshooting

**Server won't start:**
- Check if `GEMINI_API_KEY` is set
- Verify the API key is valid
- Check if port 8080 is available

**CORS errors:**
- Set `FRONTEND_URL` to your frontend domain
- Don't use `*` in production

**Rate limit errors:**
- Adjust rate limits in `server.js`
- Consider implementing user-based limits

**High costs:**
- Reduce `thinkingBudget`
- Use `gemini-2.5-flash` instead of `pro`
- Implement caching for repeated queries
