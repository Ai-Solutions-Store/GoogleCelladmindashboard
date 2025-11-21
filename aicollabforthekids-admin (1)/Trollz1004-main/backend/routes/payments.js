const express = require('express');
const router = express.Router();
const { Client, Environment } = require('square');
const logger = require('../utils/logger');
const crypto = require('crypto');

// ✅ PRODUCTION MODE - NO SANDBOX
const squareClient = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Production // LIVE TRANSACTIONS ONLY
});

// GET /api/payments/plans - Get available subscription plans
router.get('/plans', async (req, res) => {
    try {
        const result = await req.app.locals.pool.query(
            `SELECT id, name, display_name, description, price_monthly, features, tier_level
             FROM subscription_plans
             WHERE is_active = true
             ORDER BY tier_level ASC`
        );

        res.json({ success: true, plans: result.rows });
    } catch (error) {
        logger.error('Get plans error:', error);
        res.status(500).json({ error: 'Failed to retrieve subscription plans' });
    }
});

// POST /api/payments/create-payment - Process LIVE payment
router.post('/create-payment', async (req, res) => {
    try {
        const { sourceId, amount, planId, userId } = req.body;

        // Validate inputs
        if (!sourceId || !amount || !planId) {
            return res.status(400).json({ error: 'Missing required payment parameters' });
        }

        // Generate idempotency key (prevents duplicate charges)
        const idempotencyKey = crypto.randomUUID();

        // Create LIVE payment with Square
        const { result } = await squareClient.paymentsApi.createPayment({
            sourceId,
            idempotencyKey,
            amountMoney: {
                amount: Math.round(amount * 100), // Convert dollars to cents
                currency: 'USD'
            },
            locationId: process.env.SQUARE_LOCATION_ID,
            note: `Subscription: ${planId} - For The Kids (Shriners Donation)`,
            referenceId: `user_${userId || 'guest'}_plan_${planId}`
        });

        if (result.payment.status === 'COMPLETED') {
            // Record successful payment in database
            if (req.app.locals.pool) {
                await req.app.locals.pool.query(
                    `INSERT INTO payments (user_id, square_payment_id, amount, status, payment_method, metadata, created_at)
                     VALUES ($1, $2, $3, 'completed', 'card', $4, NOW())`,
                    [
                        userId || null,
                        result.payment.id,
                        amount,
                        JSON.stringify({ planId, orderId: result.payment.orderId })
                    ]
                );

                // If user authenticated, activate subscription
                if (userId) {
                    await req.app.locals.pool.query(
                        `INSERT INTO user_subscriptions (user_id, plan_id, status, started_at, current_period_start, current_period_end)
                         VALUES ($1, $2, 'active', NOW(), NOW(), NOW() + INTERVAL '1 month')
                         ON CONFLICT (user_id) DO UPDATE 
                         SET plan_id = $2, status = 'active', started_at = NOW()`,
                        [userId, planId]
                    );
                }
            }

            logger.info(`✅ LIVE PAYMENT SUCCESSFUL: ${result.payment.id} | Amount: $${amount}`);

            res.json({
                success: true,
                paymentId: result.payment.id,
                orderId: result.payment.orderId,
                receiptUrl: result.payment.receiptUrl,
                message: 'Payment processed successfully. Thank you for supporting Shriners Children\'s Hospitals!'
            });
        } else {
            logger.warn(`⚠️ Payment pending or incomplete: ${result.payment.id}`);
            res.status(400).json({
                error: 'Payment could not be completed',
                status: result.payment.status
            });
        }

    } catch (error) {
        logger.error('❌ LIVE PAYMENT FAILED:', error);

        // Parse Square error for user-friendly message
        let userMessage = 'Payment failed. Please check your card details and try again.';
        if (error.errors && error.errors.length > 0) {
            const squareError = error.errors[0];
            if (squareError.code === 'CARD_DECLINED') {
                userMessage = 'Your card was declined. Please use a different payment method.';
            } else if (squareError.code === 'INSUFFICIENT_FUNDS') {
                userMessage = 'Insufficient funds. Please use a different card.';
            } else if (squareError.code === 'INVALID_CARD') {
                userMessage = 'Invalid card details. Please check your information.';
            }
        }

        res.status(400).json({
            error: userMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/payments/webhook - Handle Square webhooks (PRODUCTION)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const event = req.body;

        logger.info('📥 Square webhook received:', event.type);

        // Handle subscription lifecycle events
        switch (event.type) {
            case 'payment.created':
                // Payment initiated
                break;
            case 'payment.updated':
                // Payment status changed
                const payment = event.data.object.payment;
                if (payment.status === 'COMPLETED') {
                    logger.info(`✅ Webhook: Payment completed - ${payment.id}`);
                } else if (payment.status === 'FAILED') {
                    logger.warn(`❌ Webhook: Payment failed - ${payment.id}`);
                }
                break;
            case 'subscription.created':
            case 'subscription.updated':
                // Handle subscription state changes
                logger.info('Subscription event:', event.data.object);
                break;
        }

        res.json({ success: true });
    } catch (error) {
        logger.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// GET /api/payments/verify/:paymentId - Verify payment status
router.get('/verify/:paymentId', async (req, res) => {
    try {
        const { result } = await squareClient.paymentsApi.getPayment(req.params.paymentId);
        
        res.json({
            success: true,
            status: result.payment.status,
            amount: result.payment.amountMoney.amount / 100,
            receiptUrl: result.payment.receiptUrl
        });
    } catch (error) {
        logger.error('Payment verification error:', error);
        res.status(404).json({ error: 'Payment not found' });
    }
});

module.exports = router;
