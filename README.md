<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1fYfAFB-5S6jjtNNJWirK8cFaq1pBmTwK

## 🔒 Security Note

This application uses **secure AI API delegation** to protect your API keys. AI calls are abstracted through `utils/aiApi.ts` which supports:
- **Development mode**: Direct API calls for local testing
- **Production mode**: Backend proxy to keep API keys secure

**Never expose API keys in frontend code in production!**

## Run Locally

**Prerequisites:** Node.js 18+

### Frontend (Development Mode)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

### Backend (Production Mode)

For production deployment, use the backend proxy server:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Follow the [Backend README](./backend/README.md) for deployment instructions

3. Set `BACKEND_API_URL` environment variable in your frontend to point to your deployed backend

## Deployment Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────▶│   Frontend   │────────▶│   Backend   │
│   (User)    │         │  (React App) │         │   (Proxy)   │
└─────────────┘         └──────────────┘         └─────────────┘
                                                          │
                                                          ▼
                                                   ┌─────────────┐
                                                   │  Gemini API │
                                                   └─────────────┘
```

**Benefits:**
- ✅ API keys never exposed to users
- ✅ Rate limiting and monitoring
- ✅ Cost control
- ✅ Security best practices

## Project Structure

```
├── components/        # React components
├── data/             # Mock data
├── utils/            # Utility functions
│   ├── aiApi.ts      # AI API abstraction layer
│   └── audio.ts      # Audio utilities
├── backend/          # Backend proxy server
│   ├── server.js     # Express server
│   ├── Dockerfile    # Container configuration
│   └── README.md     # Backend docs
├── App.tsx           # Main application
└── package.json      # Frontend dependencies
```
