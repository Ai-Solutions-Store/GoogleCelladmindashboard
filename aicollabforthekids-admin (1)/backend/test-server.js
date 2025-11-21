/**
 * AiCollabFortheKids - Test Server for Function Verification
 * Simplified backend for testing all frontend functions
 */

require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.json({
    status: 'healthy',
    platform: 'AiCollabFortheKids',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
    database: 'mock',
    uptime: process.uptime()
  });
});

// Mock Admin Stats
app.get('/api/admin/stats', (req, res) => {
  logger.info('Stats requested');
  res.json({
    mrr: 47200,
    churnRate: '2.4%',
    runway: 18,
    activeUsers: 12450
  });
});

// Mock DAO Launches
app.get('/api/dao/launches', (req, res) => {
  logger.info('DAO launches requested');
  res.json([
    {
      id: '1',
      name: 'KidsDAO',
      treasury: 2500000,
      members: 1240,
      proposals: 45,
      status: 'Active'
    },
    {
      id: '2',
      name: 'HealthTechDAO',
      treasury: 1800000,
      members: 890,
      proposals: 32,
      status: 'Active'
    }
  ]);
});

// Mock Crowdfunding Projects
app.get('/api/crowdfunding/projects', (req, res) => {
  logger.info('Crowdfunding projects requested');
  res.json([
    {
      id: '1',
      name: 'Smart Prosthetics for Kids',
      goal: 500000,
      raised: 387500,
      backers: 2341,
      status: 'funding'
    },
    {
      id: '2',
      name: 'AI-Powered Learning Platform',
      goal: 250000,
      raised: 198000,
      backers: 1562,
      status: 'funding'
    },
    {
      id: '3',
      name: 'Medical Equipment Network',
      goal: 750000,
      raised: 920000,
      backers: 4521,
      status: 'funded'
    }
  ]);
});

// Mock AI Analysis Endpoint
app.post('/api/ai/analyze', (req, res) => {
  const { item } = req.body;
  logger.info(`AI analysis requested for: ${item?.name}`);

  res.json({
    analysis: `**Business Viability Analysis for ${item?.name}**\n\nThis project shows strong potential with ${item?.backers || 'significant'} community support. Key strengths include innovative approach and social impact focus. Recommended for investment with continued monitoring of milestones.`,
    confidence: 0.87,
    recommendations: [
      'Monitor funding velocity',
      'Assess team execution capability',
      'Review technical feasibility'
    ]
  });
});

// Mock Authentication
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  logger.info(`Login attempt: ${email}`);

  if (email === 'joshlcoleman@gmail.com') {
    res.json({
      success: true,
      token: 'mock-jwt-token-12345',
      user: {
        email: 'joshlcoleman@gmail.com',
        name: 'Joshua Coleman',
        role: 'admin'
      }
    });
  } else {
    res.status(403).json({
      success: false,
      error: 'Access restricted to joshlcoleman@gmail.com'
    });
  }
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`
╔════════════════════════════════════════════════════════════╗
║         AiCollabFortheKids - TEST SERVER                   ║
║                    Version 2.1.0                           ║
║            Server running on port ${PORT}                        ║
║                                                            ║
║  📊 Mock Endpoints Active:                                 ║
║  - GET  /health                                            ║
║  - GET  /api/admin/stats                                   ║
║  - GET  /api/dao/launches                                  ║
║  - GET  /api/crowdfunding/projects                         ║
║  - POST /api/ai/analyze                                    ║
║  - POST /api/auth/login                                    ║
║                                                            ║
║  💖 FOR THE KIDS!                                          ║
╚════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
