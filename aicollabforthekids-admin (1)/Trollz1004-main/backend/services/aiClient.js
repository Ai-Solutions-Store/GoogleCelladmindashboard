/**
 * AI Client Service - Centralized Gemini API wrapper
 * All AI requests route through this service to keep API keys secure on backend
 * @module services/aiClient
 */

const axios = require('axios');
const logger = require('../utils/logger');

class AIClient {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.defaultModel = 'gemini-pro';
  }

  /**
   * Check if AI service is configured
   * @returns {boolean}
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Generate content using Gemini model
   * @param {string} prompt - The prompt text
   * @param {Object} options - Additional options
   * @param {string} options.model - Model to use (default: gemini-pro)
   * @param {Array} options.conversationHistory - Previous messages
   * @returns {Promise<Object>} Response with text and model info
   */
  async generateContent(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('AI service not configured - GEMINI_API_KEY missing');
    }

    const model = options.model || this.defaultModel;
    const contents = [];

    // Add conversation history if provided
    if (options.conversationHistory && Array.isArray(options.conversationHistory)) {
      contents.push(...options.conversationHistory);
    }

    // Add current prompt
    contents.push({
      parts: [{ text: prompt }]
    });

    try {
      const response = await axios.post(
        `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`,
        { contents },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000 // 30 second timeout
        }
      );

      const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        logger.warn('Empty response from Gemini API', { model, prompt: prompt.substring(0, 100) });
        throw new Error('Empty response from AI service');
      }

      return {
        success: true,
        text: reply,
        model,
        usage: response.data?.usageMetadata || {}
      };

    } catch (error) {
      logger.error('AI generation error:', {
        message: error.message,
        model,
        prompt: prompt.substring(0, 100)
      });

      if (error.response) {
        logger.error('AI API error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }

      throw new Error('AI generation failed: ' + error.message);
    }
  }

  /**
   * Chat with conversational context
   * @param {string} message - User message
   * @param {string} conversationHistory - Previous conversation as string
   * @returns {Promise<Object>}
   */
  async chat(message, conversationHistory = '') {
    const prompt = conversationHistory
      ? `${conversationHistory}\n\nUser: ${message}\n\nAssistant:`
      : message;

    return this.generateContent(prompt);
  }

  /**
   * Analyze compatibility between two profiles
   * @param {Object} profileA - First profile with bio and interests
   * @param {Object} profileB - Second profile with bio and interests
   * @returns {Promise<Object>}
   */
  async analyzeCompatibility(profileA, profileB) {
    const prompt = `Analyze the compatibility between these two dating profiles:

Profile A: ${profileA.bio}
Interests: ${profileA.interests}

Profile B: ${profileB.bio}
Interests: ${profileB.interests}

Provide a compatibility score (0-100) and a brief, encouraging analysis focused on shared values and potential connection points.`;

    return this.generateContent(prompt);
  }

  /**
   * Generate date suggestions
   * @param {string} location - City or location
   * @param {string} budget - Budget level (low, moderate, high)
   * @param {Object} preferences - Additional preferences
   * @returns {Promise<Object>}
   */
  async generateDateIdeas(location = 'their city', budget = 'moderate', preferences = {}) {
    const prompt = `Suggest 3 unique, creative date ideas for a couple in ${location} with a ${budget} budget.
${preferences.interests ? `Shared interests: ${preferences.interests}` : ''}
${preferences.ageRange ? `Age range: ${preferences.ageRange}` : ''}

Be specific, practical, and include estimated costs. Format as a numbered list.`;

    return this.generateContent(prompt);
  }

  /**
   * Generate content description or analysis
   * @param {string} contentType - Type of content (video, image, text)
   * @param {string} description - Content description or context
   * @returns {Promise<Object>}
   */
  async analyzeContent(contentType, description) {
    const prompt = `Analyze this ${contentType} content and provide insights:

${description}

Provide a brief, family-friendly analysis suitable for the "AiCollabForTheKids" platform.`;

    return this.generateContent(prompt);
  }
}

// Export singleton instance
module.exports = new AIClient();
