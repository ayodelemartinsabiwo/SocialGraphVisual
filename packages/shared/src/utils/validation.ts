/**
 * Validation Utilities
 * @module utils/validation
 * @created 2026-01-21
 *
 * Common validation functions for use across frontend and backend.
 */

/**
 * Check if a string is a valid email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if a string is a valid CUID
 */
export function isValidCuid(id: string): boolean {
  const cuidRegex = /^c[a-z0-9]{24}$/;
  return cuidRegex.test(id);
}

/**
 * Check if a string is a valid UUID
 */
export function isValidUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Check if a value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if a value is a positive integer
 */
export function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

/**
 * Check if a value is a valid URL
 */
export function isValidUrl(url: string): boolean {
  // Use regex for cross-platform URL validation
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
  return urlRegex.test(url);
}

/**
 * Check if file size is within limits
 */
export function isFileSizeValid(sizeBytes: number, maxMb: number): boolean {
  return sizeBytes > 0 && sizeBytes <= maxMb * 1024 * 1024;
}

/**
 * Check if file extension is allowed
 */
export function isFileExtensionAllowed(
  fileName: string,
  allowedExtensions: string[]
): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return allowedExtensions.includes(ext);
}

/**
 * Validate platform name
 */
export function isValidPlatform(platform: string): boolean {
  const validPlatforms = ['TWITTER', 'INSTAGRAM', 'LINKEDIN', 'FACEBOOK', 'TIKTOK'];
  return validPlatforms.includes(platform.toUpperCase());
}

/**
 * Validate tier name
 */
export function isValidTier(tier: string): boolean {
  const validTiers = ['FREE', 'PRO', 'CREATOR'];
  return validTiers.includes(tier.toUpperCase());
}
