/**
 * Backend Proxy Server for AI API Calls
 * 
 * This server acts as a secure proxy between the frontend and Google Gemini API,
 * ensuring that API keys are never exposed in the frontend bundle.
 * 
 * Deploy this to Google Cloud Run, AWS Lambda, or any Node.js hosting service.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // In production, set this to your frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Initialize Google GenAI client
let aiClient = null;
try {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY or API_KEY environment variable is not set');
    process.exit(1);
  }
  aiClient = new GoogleGenAI({ apiKey });
  console.log('✅ Google GenAI client initialized');
} catch (error) {
  console.error('Failed to initialize AI client:', error);
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'ai-proxy',
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/ai/analyze
 * 
 * Generate AI analysis for projects and data
 * 
 * Request body:
 * {
 *   "prompt": "Analysis prompt...",
 *   "model": "gemini-2.5-pro",  // optional
 *   "thinkingBudget": 32768      // optional
 * }
 */
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { prompt, model = 'gemini-2.5-pro', thinkingBudget = 32768 } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request: prompt is required and must be a string' 
      });
    }

    if (prompt.length > 10000) {
      return res.status(400).json({ 
        error: 'Invalid request: prompt is too long (max 10000 characters)' 
      });
    }

    // Log request (without sensitive data)
    console.log(`Analysis request - Model: ${model}, Prompt length: ${prompt.length}`);

    // Call Google Gemini API
    const response = await aiClient.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget }
      }
    });

    // Return the analysis
    res.json({ 
      text: response.text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating analysis:', error);
    
    // Don't expose internal error details to client
    res.status(500).json({ 
      error: 'Failed to generate analysis. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Proxy Server running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI endpoint: http://localhost:${PORT}/api/ai/analyze`);
});
