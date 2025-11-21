const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const aiClient = require('../services/aiClient');

// POST /api/ai/chat - Chat with Gemini AI
router.post('/chat', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!aiClient.isConfigured()) {
            return res.status(503).json({ error: 'AI service not configured' });
        }

        const result = await aiClient.chat(message, conversationHistory);

        res.json({
            success: true,
            reply: result.text,
            model: result.model
        });

    } catch (error) {
        logger.error('AI chat error:', error);
        res.status(500).json({ error: 'AI service error' });
    }
});

// POST /api/ai/match-analysis - Analyze compatibility
router.post('/match-analysis', async (req, res) => {
    try {
        const { matchId } = req.body;

        if (!aiClient.isConfigured()) {
            return res.status(503).json({ error: 'AI service not configured' });
        }

        // Get match details
        const matchResult = await req.app.locals.pool.query(
            `SELECT m.*,
                    pa.bio as bio_a, pa.interests as interests_a,
                    pb.bio as bio_b, pb.interests as interests_b
             FROM matches m
             JOIN user_profiles pa ON m.user_id_a = pa.user_id
             JOIN user_profiles pb ON m.user_id_b = pb.user_id
             WHERE m.id = $1`,
            [matchId]
        );

        if (matchResult.rows.length === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }

        const match = matchResult.rows[0];
        const result = await aiClient.analyzeCompatibility(
            { bio: match.bio_a, interests: match.interests_a },
            { bio: match.bio_b, interests: match.interests_b }
        );

        res.json({
            success: true,
            analysis: result.text,
            matchId
        });

    } catch (error) {
        logger.error('Match analysis error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

// POST /api/ai/date-suggestions - Get AI date ideas (Premium feature)
router.post('/date-suggestions', async (req, res) => {
    try {
        const { matchId, location, budget, interests, ageRange } = req.body;

        if (!aiClient.isConfigured()) {
            return res.status(503).json({ error: 'AI service not configured' });
        }

        const result = await aiClient.generateDateIdeas(
            location || 'their city',
            budget || 'moderate',
            { interests, ageRange }
        );

        // Save to database
        await req.app.locals.pool.query(
            `INSERT INTO ai_date_plans (match_id, generated_by_user_id, date_ideas, gemini_prompt)
             VALUES ($1, $2, $3, $4)`,
            [matchId, req.userId, JSON.stringify({ suggestions: result.text }), result.text.substring(0, 500)]
        );

        res.json({
            success: true,
            suggestions: result.text
        });

    } catch (error) {
        logger.error('Date suggestions error:', error);
        res.status(500).json({ error: 'Failed to generate suggestions' });
    }
});

module.exports = router;
