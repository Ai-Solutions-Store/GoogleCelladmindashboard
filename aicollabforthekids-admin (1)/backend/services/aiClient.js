const axios = require('axios');
const logger = require('../utils/logger');

class AIClient {
  constructor() {
    // Fallback precedence: explicit production key -> standard key -> legacy key name
    this.apiKey = process.env.PROD_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.defaultModel = process.env.GEMINI_MODEL || 'gemini-pro';
    this.source = this.apiKey
      ? (process.env.PROD_GEMINI_API_KEY ? 'PROD_GEMINI_API_KEY' : process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : process.env.GOOGLE_GEMINI_API_KEY ? 'GOOGLE_GEMINI_API_KEY' : 'unknown')
      : null;
  }

  isConfigured() {
    return !!this.apiKey;
  }

  getStatus() {
    return {
      configured: this.isConfigured(),
      model: this.defaultModel,
      keySource: this.source,
    };
  }

  async generateContent(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('AI service not configured - Gemini API key missing');
    }

    const model = options.model || this.defaultModel;
    const contents = [];

    if (options.conversationHistory && Array.isArray(options.conversationHistory)) {
      contents.push(...options.conversationHistory);
    }

    contents.push({ parts: [{ text: prompt }] });

    try {
      const response = await axios.post(
        `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`,
        { contents },
        { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
      );

      const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) {
        logger.warn('Empty response from Gemini API', { model, prompt: prompt.substring(0, 120) });
        throw new Error('Empty response from AI service');
      }

      return { success: true, text: reply, model, usage: response.data?.usageMetadata || {} };
    } catch (error) {
      logger.error('AI generation error', {
        message: error.message,
        stack: error.stack,
        model,
        prompt: prompt.substring(0, 120)
      });
      if (error.response) {
        logger.error('Gemini API response', { status: error.response.status, data: error.response.data });
      }
      throw new Error('AI generation failed: ' + error.message);
    }
  }

  async chat(message, conversationHistory = '') {
    const prompt = conversationHistory
      ? `${conversationHistory}\n\nUser: ${message}\n\nAssistant:`
      : message;
    return this.generateContent(prompt);
  }

  async analyzeCompatibility(profileA, profileB) {
    const prompt = `Analyze compatibility between two dating profiles and give a score (0-100) plus brief encouragement.\n\nProfile A Bio: ${profileA.bio}\nInterests: ${profileA.interests}\n\nProfile B Bio: ${profileB.bio}\nInterests: ${profileB.interests}`;
    return this.generateContent(prompt);
  }

  async generateDateIdeas(location = 'their city', budget = 'moderate', preferences = {}) {
    const prompt = `Suggest 3 creative date ideas in ${location} with a ${budget} budget.\n${preferences.interests ? 'Shared interests: ' + preferences.interests : ''}\n${preferences.ageRange ? 'Age range: ' + preferences.ageRange : ''}\nInclude estimated cost. Numbered list.`;
    return this.generateContent(prompt);
  }

  async analyzeContent(contentType, description) {
    const prompt = `Analyze this ${contentType} for family-friendly insights suitable for AiCollabForTheKids:\n\n${description}`;
    return this.generateContent(prompt);
  }
}

module.exports = new AIClient();
