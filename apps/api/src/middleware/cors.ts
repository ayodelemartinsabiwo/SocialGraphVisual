/**
 * CORS Configuration Middleware
 * @module middleware/cors
 * @created 2026-01-21
 *
 * Configures Cross-Origin Resource Sharing (CORS) policies
 * with environment-aware origin validation.
 */

import cors, { type CorsOptions } from 'cors';
import { env, isDevelopment } from '../config/index.js';

/**
 * Allowed origins from environment configuration
 */
const getAllowedOrigins = (): string[] => {
  const origins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());

  // In development, also allow localhost variations
  if (isDevelopment) {
    const devOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ];
    return [...new Set([...origins, ...devOrigins])];
  }

  return origins;
};

/**
 * Origin validation function
 */
const validateOrigin = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
): void => {
  const allowedOrigins = getAllowedOrigins();

  // Allow requests with no origin (same-origin, mobile apps, curl, etc.)
  if (!origin) {
    callback(null, true);
    return;
  }

  // Check if origin is in allowed list
  if (allowedOrigins.includes(origin)) {
    callback(null, true);
    return;
  }

  // In development, allow all localhost origins
  if (isDevelopment && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
    callback(null, true);
    return;
  }

  // Origin not allowed
  callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
};

/**
 * CORS configuration options
 */
const corsOptions: CorsOptions = {
  origin: validateOrigin,
  credentials: true, // Allow cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'Accept',
    'Origin',
  ],
  exposedHeaders: [
    'X-Request-Id',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  maxAge: 86400, // 24 hours preflight cache
  optionsSuccessStatus: 204,
};

/**
 * CORS middleware instance
 */
export const corsMiddleware = cors(corsOptions);

/**
 * Strict CORS for sensitive endpoints
 * Rejects requests from non-allowed origins completely
 */
export const strictCorsMiddleware = cors({
  ...corsOptions,
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    // Strict mode: require origin header
    if (!origin) {
      callback(new Error('Origin header required'), false);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed'), false);
    }
  },
});

export default corsMiddleware;
