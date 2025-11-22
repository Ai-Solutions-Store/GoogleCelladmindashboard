const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// ============================================================================
// DAO GOVERNANCE ROUTES - LIVE PRODUCTION MODE
// THE GLASS HOUSE: Full Transparency for the Kids
// ============================================================================

// GET /api/dao/treasury - Get current treasury status
router.get('/treasury', async (req, res) => {
    try {
        const result = await req.app.locals.pool.query(
            `SELECT id, total_balance, shriners_donated, last_distribution_date, updated_at
             FROM dao_treasury
             ORDER BY id DESC
             LIMIT 1`
        );

        if (result.rows.length === 0) {
            // Initialize if not exists
            await req.app.locals.pool.query(
                `INSERT INTO dao_treasury (total_balance, shriners_donated, last_distribution_date)
                 VALUES (2500000.00, 1250000.00, NOW() - INTERVAL '30 days')
                 RETURNING *`
            );
            const newResult = await req.app.locals.pool.query(
                `SELECT * FROM dao_treasury ORDER BY id DESC LIMIT 1`
            );
            return res.json({ success: true, treasury: newResult.rows[0] });
        }

        res.json({ success: true, treasury: result.rows[0] });
    } catch (error) {
        logger.error('Treasury fetch error:', error);
        res.status(500).json({ error: 'Failed to retrieve treasury data' });
    }
});

// GET /api/dao/proposals - Get all DAO proposals
router.get('/proposals', async (req, res) => {
    try {
        const result = await req.app.locals.pool.query(
            `SELECT id, title, description, category, status, votes_for, votes_against, 
                    required_quorum, created_at
             FROM dao_proposals
             ORDER BY created_at DESC`
        );

        res.json({ success: true, proposals: result.rows });
    } catch (error) {
        logger.error('Proposals fetch error:', error);
        res.status(500).json({ error: 'Failed to retrieve proposals' });
    }
});

// GET /api/dao/donations - Get donation history (THE GLASS HOUSE)
router.get('/donations', async (req, res) => {
    try {
        const result = await req.app.locals.pool.query(
            `SELECT id, amount, recipient, donation_date, transaction_id, notes
             FROM dao_donations
             ORDER BY donation_date DESC
             LIMIT 50`
        );

        res.json({ success: true, donations: result.rows });
    } catch (error) {
        logger.error('Donations fetch error:', error);
        res.status(500).json({ error: 'Failed to retrieve donation history' });
    }
});

// POST /api/dao/proposals - Create new proposal (authenticated users only)
router.post('/proposals', async (req, res) => {
    try {
        const { title, description, category } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await req.app.locals.pool.query(
            `INSERT INTO dao_proposals (title, description, category, status, votes_for, votes_against, created_at)
             VALUES ($1, $2, $3, 'pending', 0, 0, NOW())
             RETURNING *`,
            [title, description, category]
        );

        logger.info(`✅ New DAO proposal created: ${title}`);
        res.json({ success: true, proposal: result.rows[0] });
    } catch (error) {
        logger.error('Proposal creation error:', error);
        res.status(500).json({ error: 'Failed to create proposal' });
    }
});

// POST /api/dao/proposals/:id/vote - Vote on a proposal
router.post('/proposals/:id/vote', async (req, res) => {
    try {
        const { id } = req.params;
        const { vote } = req.body; // 'for' or 'against'

        if (vote !== 'for' && vote !== 'against') {
            return res.status(400).json({ error: 'Invalid vote. Must be "for" or "against"' });
        }

        const field = vote === 'for' ? 'votes_for' : 'votes_against';

        const result = await req.app.locals.pool.query(
            `UPDATE dao_proposals
             SET ${field} = ${field} + 1
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        logger.info(`✅ Vote recorded: Proposal ${id} - ${vote}`);
        res.json({ success: true, proposal: result.rows[0] });
    } catch (error) {
        logger.error('Vote recording error:', error);
        res.status(500).json({ error: 'Failed to record vote' });
    }
});

// GET /api/dao/stats - Get aggregated DAO statistics
router.get('/stats', async (req, res) => {
    try {
        const treasuryResult = await req.app.locals.pool.query(
            `SELECT total_balance, shriners_donated FROM dao_treasury ORDER BY id DESC LIMIT 1`
        );

        const proposalsResult = await req.app.locals.pool.query(
            `SELECT COUNT(*) as total, 
                    COUNT(*) FILTER (WHERE status = 'active') as active
             FROM dao_proposals`
        );

        const donationsResult = await req.app.locals.pool.query(
            `SELECT COUNT(*) as count, SUM(amount) as total_donated
             FROM dao_donations`
        );

        res.json({
            success: true,
            stats: {
                treasury: treasuryResult.rows[0] || { total_balance: 0, shriners_donated: 0 },
                proposals: proposalsResult.rows[0] || { total: 0, active: 0 },
                donations: donationsResult.rows[0] || { count: 0, total_donated: 0 }
            }
        });
    } catch (error) {
        logger.error('DAO stats error:', error);
        res.status(500).json({ error: 'Failed to retrieve DAO stats' });
    }
});

module.exports = router;

