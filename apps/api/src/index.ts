/**
 * Visual Social Graph API - Express Entry Point
 * @module api
 * @updated 2026-01-21
 */

import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import {
  env,
  isProduction,
  connectDatabase,
  disconnectDatabase,
  connectRedis,
  disconnectRedis,
  checkDatabaseHealth,
  checkRedisHealth,
} from './config/index.js';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimit.js';
import { requestLogger } from './middleware/logger.js';

// Security middleware imports
import { corsMiddleware } from './middleware/cors.js';
import { inputSanitizer } from './middleware/inputSanitizer.js';
import { patternDetector } from './middleware/patternDetector.js';
import { securityGuard } from './middleware/securityGuard.js';
import { csrfProtection, getCsrfTokenHandler } from './middleware/csrf.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import graphRoutes from './routes/graph.routes.js';
import insightRoutes from './routes/insight.routes.js';
import exportRoutes from './routes/export.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

/**
 * Create and configure Express application
 */
function createApp(): Express {
  const app = express();

  // ============================================================
  // SECURITY MIDDLEWARE (5 Layer Protection)
  // ============================================================

  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: isProduction,
    crossOriginEmbedderPolicy: isProduction,
  }));

  // CORS (using centralized configuration)
  app.use(corsMiddleware);

  // Trust proxy for correct IP detection behind load balancer
  app.set('trust proxy', 1);

  // ============================================================
  // PARSING MIDDLEWARE
  // ============================================================

  // Cookie parser
  app.use(cookieParser());

  // JSON body parser (skip for webhook routes that need raw body)
  app.use((req, res, next) => {
    if (req.path.startsWith('/webhooks')) {
      next();
    } else {
      express.json({ limit: '10mb' })(req, res, next);
    }
  });

  // URL-encoded body parser
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ============================================================
  // LOGGING & RATE LIMITING
  // ============================================================

  // Request logging
  app.use(requestLogger);

  // Rate limiting (skip in test) - Layer 2
  if (env.NODE_ENV !== 'test') {
    app.use(rateLimiter);
  }

  // ============================================================
  // SECURITY LAYERS (3-5)
  // ============================================================

  // Layer 1: Input Sanitization
  app.use(inputSanitizer);

  // Layer 3: Pattern Detection (runs before security guard)
  app.use(patternDetector);

  // Layer 4-5: Behavioral Analysis & Automatic Response
  app.use(securityGuard);

  // CSRF Token endpoint (before CSRF protection)
  app.get('/api/v1/csrf-token', getCsrfTokenHandler);

  // CSRF Protection for state-changing requests
  app.use(csrfProtection);

  // ============================================================
  // HEALTH CHECK
  // ============================================================

  app.get('/health', async (_req: Request, res: Response) => {
    const dbHealthy = await checkDatabaseHealth();
    const redisHealthy = await checkRedisHealth();

    const status = dbHealthy ? 'healthy' : 'unhealthy';
    const statusCode = dbHealthy ? 200 : 503;

    res.status(statusCode).json({
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: dbHealthy ? 'connected' : 'disconnected',
        redis: redisHealthy ? 'connected' : 'not configured',
      },
    });
  });

  // ============================================================
  // API ROUTES
  // ============================================================

  const apiPrefix = '/api/v1';

  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/users`, userRoutes);
  app.use(`${apiPrefix}/graphs`, graphRoutes);
  app.use(`${apiPrefix}/insights`, insightRoutes);
  app.use(`${apiPrefix}/exports`, exportRoutes);

  // Webhooks (no API prefix)
  app.use('/webhooks', webhookRoutes);

  // ============================================================
  // ERROR HANDLING
  // ============================================================

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
}

/**
 * Start the server
 */
async function start(): Promise<void> {
  try {
    // Connect to services
    await connectDatabase();
    await connectRedis();

    // Create app
    const app = createApp();

    // Start listening
    const server = app.listen(env.PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🌐 Visual Social Graph API                      ║
║                                                   ║
║   Server running on port ${env.PORT.toString().padEnd(24)}║
║   Environment: ${env.NODE_ENV.padEnd(33)}║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        console.log('HTTP server closed');

        await disconnectDatabase();
        await disconnectRedis();

        console.log('All connections closed');
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
start();

export { createApp };
