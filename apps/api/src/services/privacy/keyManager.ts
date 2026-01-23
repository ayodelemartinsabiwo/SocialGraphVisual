/**
 * Key Manager Service
 * @module services/privacy/keyManager
 *
 * Manages per-user secret keys for HMAC-SHA256 pseudonymization.
 * Keys are stored encrypted and never exposed to clients.
 */

import crypto from 'crypto';
import { prisma } from '../../config/database.js';

// ============================================================
// CONSTANTS
// ============================================================

const KEY_LENGTH = 32; // 256 bits
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// ============================================================
// KEY GENERATION
// ============================================================

/**
 * Generate a new secret key for a user
 */
export function generateSecretKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Generate a deterministic key from user ID (for recovery)
 */
export function deriveKeyFromUserId(userId: string, masterKey: string): string {
  return crypto
    .createHmac('sha256', masterKey)
    .update(userId)
    .digest('hex');
}

// ============================================================
// KEY ENCRYPTION (At-Rest Protection)
// ============================================================

/**
 * Get master encryption key from environment
 */
function getMasterKey(): Buffer {
  const masterKeyHex = process.env.MASTER_ENCRYPTION_KEY;
  if (!masterKeyHex) {
    throw new Error('MASTER_ENCRYPTION_KEY environment variable not set');
  }

  const keyBuffer = Buffer.from(masterKeyHex, 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error('MASTER_ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
  }

  return keyBuffer;
}

/**
 * Encrypt a secret key for storage
 */
export function encryptKey(secretKey: string): string {
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, masterKey, iv);

  let encrypted = cipher.update(secretKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt a stored secret key
 */
export function decryptKey(encryptedKey: string): string {
  const masterKey = getMasterKey();
  const [ivHex, authTagHex, encrypted] = encryptedKey.split(':');

  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error('Invalid encrypted key format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, masterKey, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// ============================================================
// KEY STORAGE (Database Operations)
// ============================================================

/**
 * Create and store a new secret key for a user
 */
export async function createUserKey(userId: string): Promise<string> {
  const secretKey = generateSecretKey();
  const encryptedKey = encryptKey(secretKey);

  await prisma.user.update({
    where: { id: userId },
    data: { secretKey: encryptedKey },
  });

  return secretKey;
}

/**
 * Get the secret key for a user (decrypted)
 */
export async function getUserKey(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { secretKey: true },
  });

  if (!user?.secretKey) {
    return null;
  }

  try {
    return decryptKey(user.secretKey);
  } catch (error) {
    console.error('Failed to decrypt user key:', error);
    return null;
  }
}

/**
 * Rotate a user's secret key
 * WARNING: This will invalidate all existing pseudonymized data
 */
export async function rotateUserKey(userId: string): Promise<string> {
  const newKey = generateSecretKey();
  const encryptedKey = encryptKey(newKey);

  await prisma.user.update({
    where: { id: userId },
    data: { secretKey: encryptedKey },
  });

  return newKey;
}

/**
 * Ensure a user has a secret key (create if missing)
 */
export async function ensureUserKey(userId: string): Promise<string> {
  const existingKey = await getUserKey(userId);

  if (existingKey) {
    return existingKey;
  }

  return createUserKey(userId);
}

// ============================================================
// KEY VALIDATION
// ============================================================

/**
 * Validate that a key meets security requirements
 */
export function validateKey(key: string): { valid: boolean; error?: string } {
  if (!key) {
    return { valid: false, error: 'Key is empty' };
  }

  if (key.length !== KEY_LENGTH * 2) {
    // Hex string is 2x byte length
    return { valid: false, error: `Key must be ${KEY_LENGTH * 2} hex characters` };
  }

  if (!/^[a-f0-9]+$/i.test(key)) {
    return { valid: false, error: 'Key must be a valid hex string' };
  }

  return { valid: true };
}

/**
 * Check if master encryption key is properly configured
 */
export function checkMasterKeyConfiguration(): {
  configured: boolean;
  error?: string;
} {
  try {
    getMasterKey();
    return { configured: true };
  } catch (error) {
    return {
      configured: false,
      error: (error as Error).message,
    };
  }
}

export default {
  generateSecretKey,
  deriveKeyFromUserId,
  encryptKey,
  decryptKey,
  createUserKey,
  getUserKey,
  rotateUserKey,
  ensureUserKey,
  validateKey,
  checkMasterKeyConfiguration,
};
