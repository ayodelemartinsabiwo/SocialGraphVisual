/**
 * Authentication Service
 * @module services/auth/AuthService
 */

import { randomBytes, createHash } from 'crypto';
import { env } from '../../config/index.js';
import { prisma } from '../../config/database.js';
import { JwtService, type TokenPair } from './JwtService.js';
import { UnauthorizedError, BadRequestError } from '../../middleware/errorHandler.js';
import { logger } from '../../middleware/logger.js';

// ============================================================
// GOOGLE OAUTH TYPES
// ============================================================

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

// ============================================================
// TYPES
// ============================================================

export interface AuthResult extends TokenPair {
  user: {
    id: string;
    email: string;
    name: string | null;
    tier: string;
  };
}

export interface GoogleAuthResult extends AuthResult {
  isNewUser: boolean;
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Generate secure random token
 */
function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Hash token for storage (one-way)
 */
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Parse duration string to milliseconds
 */
function parseDurationMs(duration: string | undefined): number {
  if (!duration) return 15 * 60 * 1000; // default 15 minutes

  const match = duration.match(/^(\d+)([mhd])$/);
  if (!match || !match[1] || !match[2]) return 15 * 60 * 1000; // default 15 minutes

  const value = match[1];
  const unit = match[2];
  const num = parseInt(value, 10);

  switch (unit) {
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
}

// ============================================================
// AUTH SERVICE
// ============================================================

export const AuthService = {
  /**
   * Request magic link for email login
   */
  async requestMagicLink(email: string): Promise<{ expiresIn: number }> {
    const normalizedEmail = email.toLowerCase().trim();

    // Generate token
    const token = generateToken();
    const hashedToken = hashToken(token);
    const expiresInMs = parseDurationMs(env.MAGIC_LINK_EXPIRES_IN);
    const expiresAt = new Date(Date.now() + expiresInMs);

    // Delete any existing magic links for this email
    await prisma.magicLink.deleteMany({
      where: { email: normalizedEmail },
    });

    // Create new magic link
    await prisma.magicLink.create({
      data: {
        token: hashedToken,
        email: normalizedEmail,
        expiresAt,
      },
    });

    // Build magic link URL
    const magicLinkUrl = `${env.CORS_ORIGIN}/auth/verify?token=${token}`;

    // TODO: Send email using EmailService
    // For now, log the link in development
    if (env.NODE_ENV !== 'production') {
      logger.info('Magic link generated (dev only)', {
        email: normalizedEmail,
        url: magicLinkUrl,
        token, // Only log in development!
      });
    }

    // In production, send email
    // await EmailService.sendMagicLink(normalizedEmail, magicLinkUrl);

    return { expiresIn: Math.floor(expiresInMs / 1000) };
  },

  /**
   * Verify magic link token
   */
  async verifyMagicLink(token: string): Promise<AuthResult> {
    const hashedToken = hashToken(token);

    // Find magic link
    const magicLink = await prisma.magicLink.findUnique({
      where: { token: hashedToken },
    });

    if (!magicLink) {
      throw new UnauthorizedError('Invalid or expired magic link', 'INVALID_TOKEN');
    }

    // Check if expired
    if (magicLink.expiresAt < new Date()) {
      await prisma.magicLink.delete({ where: { id: magicLink.id } });
      throw new UnauthorizedError('Magic link has expired', 'TOKEN_EXPIRED');
    }

    // Check if already used
    if (magicLink.usedAt) {
      throw new UnauthorizedError('Magic link has already been used', 'TOKEN_USED');
    }

    // Mark as used
    await prisma.magicLink.update({
      where: { id: magicLink.id },
      data: { usedAt: new Date() },
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: magicLink.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: magicLink.email,
          tier: 'FREE',
        },
      });

      logger.info('New user created via magic link', { userId: user.id });
    }

    // Check if user is deleted
    if (user.deletedAt) {
      throw new UnauthorizedError('This account has been deleted', 'ACCOUNT_DELETED');
    }

    // Generate tokens
    const tokens = await JwtService.generateTokenPair({
      sub: user.id,
      email: user.email,
      tier: user.tier,
    });

    logger.info('User authenticated via magic link', { userId: user.id });

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
      },
    };
  },

  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(code: string, _state?: string): Promise<GoogleAuthResult> {
    // Verify Google credentials are configured
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_CALLBACK_URL) {
      throw new BadRequestError('Google OAuth is not configured', 'OAUTH_NOT_CONFIGURED');
    }

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: env.GOOGLE_CALLBACK_URL,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        logger.error('Google token exchange failed', { error });
        throw new UnauthorizedError('Failed to authenticate with Google', 'OAUTH_FAILED');
      }

      const tokenData = await tokenResponse.json() as GoogleTokenResponse;

      // Get user info from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userInfoResponse.ok) {
        throw new UnauthorizedError('Failed to get user info from Google', 'OAUTH_FAILED');
      }

      const googleUser = await userInfoResponse.json() as GoogleUserInfo;

      if (!googleUser.email) {
        throw new UnauthorizedError('Google account does not have an email', 'OAUTH_NO_EMAIL');
      }

      // Find or create user
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { googleId: googleUser.id },
            { email: googleUser.email.toLowerCase() },
          ],
        },
      });

      let isNewUser = false;

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: googleUser.email.toLowerCase(),
            name: googleUser.name ?? null,
            googleId: googleUser.id,
            tier: 'FREE',
          },
        });
        isNewUser = true;

        logger.info('New user created via Google OAuth', { userId: user.id });
      } else if (!user.googleId) {
        // Link Google account to existing user
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleUser.id,
            name: user.name || googleUser.name || null,
          },
        });

        logger.info('Google account linked to existing user', { userId: user.id });
      }

      // Check if user is deleted
      if (user.deletedAt) {
        throw new UnauthorizedError('This account has been deleted', 'ACCOUNT_DELETED');
      }

      // Generate tokens
      const tokens = await JwtService.generateTokenPair({
        sub: user.id,
        email: user.email,
        tier: user.tier,
      });

      logger.info('User authenticated via Google OAuth', { userId: user.id, isNewUser });

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          tier: user.tier,
        },
        isNewUser,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      logger.error('Google OAuth error', { error: (error as Error).message });
      throw new UnauthorizedError('Failed to authenticate with Google', 'OAUTH_FAILED');
    }
  },

  /**
   * Refresh tokens using refresh token
   */
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    // Verify refresh token
    const userId = await JwtService.verifyRefreshToken(refreshToken);

    if (!userId) {
      throw new UnauthorizedError('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedError('User not found', 'USER_NOT_FOUND');
    }

    // Rotate refresh token and generate new access token
    const newRefreshToken = await JwtService.rotateRefreshToken(refreshToken, userId);
    const accessToken = JwtService.generateAccessToken({
      sub: user.id,
      email: user.email,
      tier: user.tier,
    });

    // Get expiry time
    const expiresIn = 15 * 60; // 15 minutes (default)

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    };
  },

  /**
   * Logout - revoke refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      await JwtService.revokeRefreshToken(refreshToken);
    } catch {
      // Ignore errors - token might not exist
    }
  },

  /**
   * Logout all sessions for a user
   */
  async logoutAll(userId: string): Promise<void> {
    await JwtService.revokeAllUserTokens(userId);
  },
};
