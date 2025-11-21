/**
 * YouAndINotAI - God Tier Dating Platform
 * Main Server File
 * Version: 2.0.0
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const Redis = require('ioredis');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchingRoutes = require('./routes/matching');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');

// Import middleware
const { authenticateToken, requirePremium, requireAdmin } = require('./middleware/auth');
const logger = require('./utils/logger');

// ============================================================================
// CONFIGURATION
// ============================================================================

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.APP_URL || '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

const dbConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
} : {
    user: 'postgres',
    host: 'localhost',
    database: 'youandinotai',
    password: 'password',
    port: 5432,
};

const pool = new Pool({
    ...dbConfig,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    logger.error('Unexpected database error:', err);
});

pool.query('SELECT NOW()').then(() => {
    logger.info('Database connected successfully');
}).catch(err => {
    logger.error('Database connection failed (Proceeding without DB for static serving):', err.message);
});

// ============================================================================
// REDIS CONNECTION
// ============================================================================

let redis;
if (process.env.REDIS_HOST) {
    redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
    });
    redis.on('connect', () => logger.info('Redis connected successfully'));
    redis.on('error', (err) => logger.error('Redis connection error:', err));
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev ease, enable in strict prod
}));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (NODE_ENV === 'production') {
    app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
} else {
    app.use(morgan('dev'));
}

// ============================================================================
// STATIC FILES (THE EMPIRE MERGE)
// ============================================================================

app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', async (req, res) => {
    res.json({
        status: 'healthy',
        platform: 'YouAndINotAI',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        database: 'connected',
        uptime: process.uptime()
    });
});

// ============================================================================
// API ROUTES
// ============================================================================

app.locals.pool = pool;
app.locals.redis = redis;

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/matching', authenticateToken, matchingRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);
app.use('/api/ai', authenticateToken, requirePremium, aiRoutes);
app.use('/api/admin', authenticateToken, requireAdmin, adminRoutes);

// ============================================================================
// SPA FALLBACK
// ============================================================================

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// ============================================================================
// START SERVER
// ============================================================================

server.listen(PORT, '0.0.0.0', () => {
    logger.info(`
╔════════════════════════════════════════════════════════════╗
║         AiCollabFortheKids - EMPIRE ONLINE                 ║
║                    Version 2.0.0                           ║
║  Server running on port ${PORT}                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

module.exports = { app, server, io, pool, redis };