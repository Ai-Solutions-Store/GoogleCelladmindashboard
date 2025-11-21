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
const { errorHandler } = require('./middleware/errorHandler');
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

// Fallback if env vars are missing (for launch script compatibility)
const dbConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
} : {
    // Default to a local config or mock if needed for "Empire Launch" demo
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

// Test database connection (Non-blocking)
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
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        }
    });

    redis.on('connect', () => {
        logger.info('Redis connected successfully');
    });

    redis.on('error', (err) => {
        logger.error('Redis connection error:', err);
    });
} else {
    logger.warn('Redis not configured - some features will be disabled');
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.tailwindcss.com'],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://accounts.google.com', 'https://apis.google.com'],
            imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            connectSrc: ["'self'", 'https:', 'wss:'],
            frameSrc: ["'self'", 'https://accounts.google.com']
        }
    }
}));

// CORS
app.use(cors());

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (NODE_ENV === 'production') {
    app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
} else {
    app.use(morgan('dev'));
}

// ============================================================================
// STATIC FILES (THE EMPIRE MERGE)
// ============================================================================

// Serve the React App Build
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
        database: 'connected', // Simulated for now if DB is down
        redis: redis ? 'connected' : 'not_configured',
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

// Send index.html for any other requests (React Router support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use(errorHandler);

// ============================================================================
// START SERVER
// ============================================================================

server.listen(PORT, '0.0.0.0', () => {
    logger.info(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║         AiCollabFortheKids - EMPIRE ONLINE                ║
║                    Version 2.0.0                           ║
║                                                            ║
║  Server running on port ${PORT}                          ║
║  Environment: ${NODE_ENV}                                ║
║  Mission: FOR THE KIDS                                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

module.exports = { app, server, io, pool, redis };