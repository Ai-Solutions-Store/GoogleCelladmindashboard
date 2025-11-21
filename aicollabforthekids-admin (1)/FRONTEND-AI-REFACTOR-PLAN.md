# Frontend AI Refactoring Plan - For The Kids Security Update

## Overview
This document outlines the strategy to remove direct Gemini API key exposure from frontend components while maintaining functionality.

## Problem
Multiple React components currently instantiate `GoogleGenAI` client-side with `process.env.API_KEY`, exposing the API key in the browser bundle.

## Solution Strategy

### Phase 1: Backend Infrastructure ✅ COMPLETE
- Created `backend/services/aiClient.js` - centralized AI service wrapper
- Refactored `backend/routes/ai.js` to use aiClient service
- Created `utils/aiApi.ts` - frontend utilities for backend proxy calls
- Removed `API_KEY` from `vite.config.ts` and CI/CD workflow
- Updated `guardian/revenue-guardian.js` to use `GEMINI_API_KEY`

### Phase 2: Component Refactoring Strategy

#### Components Using Direct Google GenAI SDK:
These components use advanced Gemini features (image generation, video, multimodal) that require the SDK:

1. **MediaStudio.tsx** - Image/video generation, voice synthesis
2. **CommandCenter.tsx** - Advanced AI interactions with thinking budget
3. **KidsCorner.tsx** - Educational content generation
4. **LiveChatView.tsx** - Real-time chat with AI
5. **ImpactTracker.tsx** - Analytics generation
6. **CometBrowser.tsx** - Web content analysis
7. **ChatView.tsx** - Conversational AI
8. **App.tsx** - Core app AI features

#### Recommended Approach:

**Option A: Backend-Only (Most Secure for Kids)**
- Move ALL AI generation to backend routes
- Create specialized endpoints for each feature:
  - `/api/ai/generate-image` - Imagen proxy
  - `/api/ai/generate-video` - Veo proxy
  - `/api/ai/voice-synthesis` - Voice generation
  - `/api/ai/educational-content` - Kids content
  - `/api/ai/analyze-web` - Web analysis
- Frontend sends parameters only, receives results
- **Pros**: Zero API key exposure, full security
- **Cons**: More backend code, slightly higher latency

**Option B: Server-Side Rendering with Secure Token (Hybrid)**
- Keep frontend SDK for interactive features
- Backend issues temporary, scoped API tokens (short-lived)
- Token has usage limits and rate limiting
- **Pros**: Better UX for real-time features
- **Cons**: More complex token management

**Option C: Environment-Based (Least Secure - NOT RECOMMENDED)**
- Keep current structure but use server-side env injection
- **Cons**: Still exposes key in client bundle

## Recommendation: Option A (Backend-Only)

### Implementation Plan for Option A:

1. **Extend backend/routes/ai.js** with new endpoints:
   ```javascript
   router.post('/generate-image', async (req, res) => {
     // Use aiClient to call Imagen
   });
   
   router.post('/generate-video', async (req, res) => {
     // Use aiClient for video generation
   });
   
   router.post('/voice-synthesis', async (req, res) => {
     // Use aiClient for voice
   });
   ```

2. **Update utils/aiApi.ts** with frontend helpers:
   ```typescript
   export async function generateImage(prompt: string, aspectRatio: string) {
     return fetch('/api/ai/generate-image', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ prompt, aspectRatio })
     });
   }
   ```

3. **Refactor each component**:
   - Replace `new GoogleGenAI({ apiKey: process.env.API_KEY })` calls
   - Use `import { generateImage, ... } from '../utils/aiApi'`
   - Keep UI logic, delegate AI calls to backend

4. **Remove @google/genai from frontend dependencies**:
   - Move to backend package.json only
   - Reduces client bundle size significantly

## Security Benefits for Kids Platform:
- ✅ No API keys in browser
- ✅ Centralized rate limiting and monitoring
- ✅ Audit trail of all AI requests
- ✅ Content filtering at backend layer
- ✅ Protection against client-side key extraction
- ✅ Compliance with child safety regulations

## Next Steps:
1. Create remaining backend AI proxy endpoints
2. Update aiApi.ts with complete helper suite
3. Refactor components one-by-one
4. Test each feature end-to-end
5. Remove frontend @google/genai dependency
6. Update documentation

## Timeline Estimate:
- Backend endpoints: 2-3 hours
- Frontend refactoring: 4-6 hours
- Testing & validation: 2 hours
- **Total**: ~8-11 hours of focused development

## Notes:
- This protects the kids and maintains full functionality
- Backend can add additional safety filters before calling Gemini
- Monitoring becomes centralized and easier
- Complies with "For The Kids" security policy

---
**Status**: Phase 1 Complete | Phase 2 Ready to Begin
**Priority**: HIGH - Security critical for children's platform
**Owner**: AI Agent (Joshua Coleman approval)
