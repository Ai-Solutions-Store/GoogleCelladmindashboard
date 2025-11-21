/**
 * AI API Utilities - Frontend helpers for backend AI proxy
 * All Gemini interactions route through backend to protect API keys
 * @module utils/aiApi
 */

const AI_BASE_URL = '/api/ai';

/**
 * Chat with AI assistant
 * @param {string} message - User message
 * @param {string} conversationHistory - Optional conversation context
 * @returns {Promise<Object>} Response with reply text
 */
export async function chatWithAI(message, conversationHistory = '') {
  const response = await fetch(`${AI_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationHistory })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'AI chat failed');
  }

  return response.json();
}

/**
 * Analyze match compatibility
 * @param {string} matchId - Match ID
 * @returns {Promise<Object>} Analysis result
 */
export async function analyzeMatch(matchId) {
  const response = await fetch(`${AI_BASE_URL}/match-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Match analysis failed');
  }

  return response.json();
}

/**
 * Generate date suggestions
 * @param {Object} params - Parameters for date generation
 * @param {string} params.matchId - Match ID
 * @param {string} params.location - Location/city
 * @param {string} params.budget - Budget level
 * @param {string} params.interests - Shared interests
 * @returns {Promise<Object>} Date suggestions
 */
export async function generateDateIdeas(params) {
  const response = await fetch(`${AI_BASE_URL}/date-suggestions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Date generation failed');
  }

  return response.json();
}

/**
 * Generic AI generation for content analysis
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} Generated text
 */
export async function generateContent(prompt) {
  const result = await chatWithAI(prompt);
  return result.reply;
}
