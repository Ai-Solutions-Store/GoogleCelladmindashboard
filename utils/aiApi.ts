/**
 * AI API Abstraction Layer
 * 
 * This module provides an abstraction layer for AI API calls,
 * supporting both direct API mode (development) and proxy mode (production).
 * 
 * In production, all AI calls should go through a backend proxy to avoid
 * exposing API keys in the frontend bundle.
 */

import { GoogleGenAI } from '@google/genai';

// Type definitions for API requests and responses
export interface AnalysisRequest {
  prompt: string;
  model?: string;
  thinkingBudget?: number;
}

export interface AnalysisResponse {
  text: string;
  error?: string;
}

/**
 * Determines if we should use the backend proxy or direct API calls.
 * In production, this should always return true to use the backend proxy.
 */
const useBackendProxy = (): boolean => {
  // Check if we're in production mode or if a backend URL is configured
  const backendUrl = process.env.BACKEND_API_URL;
  return backendUrl !== undefined && backendUrl !== '';
};

/**
 * Call the backend proxy to generate AI analysis
 */
async function callBackendProxy(request: AnalysisRequest): Promise<AnalysisResponse> {
  const backendUrl = process.env.BACKEND_API_URL || '';
  
  try {
    const response = await fetch(`${backendUrl}/api/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Backend proxy error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { text: data.text };
  } catch (error) {
    console.error('Backend proxy call failed:', error);
    return {
      text: '',
      error: 'Failed to connect to AI service. Please try again later.',
    };
  }
}

/**
 * Direct API call (for development only)
 * WARNING: This exposes the API key in the frontend bundle
 */
async function callDirectAPI(request: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = request.model || 'gemini-2.5-pro';
    const thinkingBudget = request.thinkingBudget || 32768;

    const response = await ai.models.generateContent({
      model,
      contents: request.prompt,
      config: {
        thinkingConfig: { thinkingBudget },
      },
    });

    return { text: response.text };
  } catch (error) {
    console.error('Direct API call failed:', error);
    return {
      text: '',
      error: 'Sorry, I couldn\'t generate an analysis at this time. Please check the API key and try again.',
    };
  }
}

/**
 * Generate AI analysis for data or projects
 * 
 * This function automatically routes requests to either the backend proxy (production)
 * or direct API calls (development), based on configuration.
 * 
 * @param request - The analysis request parameters
 * @returns Promise with the analysis response
 */
export async function generateAnalysis(request: AnalysisRequest): Promise<AnalysisResponse> {
  if (useBackendProxy()) {
    return callBackendProxy(request);
  } else {
    return callDirectAPI(request);
  }
}

/**
 * Utility function to create an analysis prompt from structured data
 */
export function createAnalysisPrompt(
  title: string,
  data: any,
  context?: string
): string {
  let prompt = `Analyze the following ${title.toLowerCase()} and provide insights and recommendations. Be concise and use markdown formatting.`;
  
  if (context) {
    prompt += ` ${context}`;
  }
  
  prompt += `\n\nData: ${JSON.stringify(data)}`;
  
  return prompt;
}
