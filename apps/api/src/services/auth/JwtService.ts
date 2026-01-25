/**
 * JWT Service
 * @module services/auth/JwtService
 */

import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { env } from '../../config/index.js';
import { prisma } from '../../config/database.js';
import type { UserTier } from '@vsg/shared';

// ============================================================
// TYPES
// ============================================================

export interface TokenPayload {
  sub: string; // user id
  email: string;
  tier: UserTier;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================================
// JWT SERVICE
// ============================================================

/**
 * Parse duration string to seconds
 * Supports: 15m, 1h, 7d, 30d
 */
function parseDuration(duration: string | undefined, defaultValue: number = 15 * 60): number {
  if (!duration) return defaultValue;

  const match = duration.match(/^(\d+)([mhd])$/);
  if (!match || !match[1] || !match[2]) {
    return defaultValue;
  }

  const value = match[1];
  const unit = match[2];
  const num = parseInt(value, 10);

  switch (unit) {
    case 'm':
      return num * 60;
    case 'h':
      return num * 60 * 60;
    case 'd':
      return num * 24 * 60 * 60;
    default:
      return defaultValue;
  }
}

export const JwtService = {
  /**
   * Generate access token
   */
  generateAccessToken(payload: TokenPayload): string {
    const expiresIn = parseDuration(env.JWT_EXPIRES_IN);

    return jwt.sign(
      {
        sub: payload.sub,
        email: payload.email,
        tier: payload.tier,
      },
      env.JWT_SECRET,
      {
        expiresIn,
        algorithm: 'HS256',
      }
    );
  },

  /**
   * Generate refresh token
   */
  async generateRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(64).toString('hex');
    const expiresIn = parseDuration(env.REFRESH_TOKEN_EXPIRES_IN);

    // Store in database
    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      },
    });

    return token;
  },

  /**
   * Generate both access and refresh tokens
   */
  async generateTokenPair(payload: TokenPayload): Promise<TokenPair> {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload.sub);
    const expiresIn = parseDuration(env.JWT_EXPIRES_IN);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  },

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & TokenPayload;

    return {
      sub: decoded.sub,
      email: decoded.email,
      tier: decoded.tier,
    };
  },

  /**
   * Verify refresh token and return user ID
   */
  async verifyRefreshToken(token: string): Promise<string | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken) {
      return null;
    }

    // Check if revoked
    if (refreshToken.revokedAt) {
      return null;
    }

    // Check if expired
    if (refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken.userId;
  },

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  },

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  },

  /**
   * Rotate refresh token (revoke old, create new)
   */
  async rotateRefreshToken(oldToken: string, userId: string): Promise<string> {
    // Revoke old token
    await this.revokeRefreshToken(oldToken);

    // Generate new token
    return this.generateRefreshToken(userId);
  },

  /**
   * Clean up expired tokens
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  },
};
