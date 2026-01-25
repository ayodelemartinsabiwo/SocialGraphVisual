/**
 * Privacy Service
 * @module services/privacy
 *
 * Privacy-preserving data handling including pseudonymization,
 * key management, and sensitive data scrubbing.
 */

// Key Management
export {
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
} from './keyManager.js';

// Pseudonymization
export {
  pseudonymize,
  hashForDeduplication,
  wouldMatch,
  pseudonymizeBatch,
  createContext,
  pseudonymizeNode,
  pseudonymizeEdge,
  pseudonymizeGraph,
  scrubSensitiveFields,
  scrubAllSensitive,
  isPseudonymized,
  looksLikePseudoId,
  createAuditEntry,
  DEFAULT_SENSITIVE_FIELDS,
  type PseudonymizationContext,
  type PseudonymizedNode,
  type PseudonymizedEdge,
} from './pseudonymizer.js';

// Re-export default objects for convenience
export { default as keyManager } from './keyManager.js';
export { default as pseudonymizer } from './pseudonymizer.js';
