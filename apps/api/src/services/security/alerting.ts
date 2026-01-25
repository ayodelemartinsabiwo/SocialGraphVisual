/**
 * Security Alerting Service
 * @module services/security/alerting
 * @created 2026-01-21
 *
 * Handles security alert notifications through multiple channels:
 * - Logging (always)
 * - Email notifications (production)
 * - Webhook notifications (if configured)
 */

import { logger } from '../../middleware/logger.js';
import { env, isDevelopment } from '../../config/index.js';
import type { ThreatProfile } from './threatScoring.js';
import type { BlockEntry } from './blockList.js';

// ============================================================
// TYPES
// ============================================================

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';

export type AlertCategory =
  | 'threat_detected'
  | 'block_triggered'
  | 'attack_pattern'
  | 'rate_limit_exceeded'
  | 'auth_anomaly'
  | 'system_security';

export interface SecurityAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  identifier: string | undefined;
  details: Record<string, unknown> | undefined;
  timestamp: number;
}

export interface AlertChannel {
  name: string;
  enabled: boolean;
  send: (alert: SecurityAlert) => Promise<void>;
}

// ============================================================
// ALERT GENERATION
// ============================================================

let alertCounter = 0;

/**
 * Generate a unique alert ID
 */
function generateAlertId(): string {
  alertCounter++;
  return `alert_${Date.now()}_${alertCounter}`;
}

/**
 * Create a security alert object
 */
function createAlert(
  severity: AlertSeverity,
  category: AlertCategory,
  title: string,
  description: string,
  identifier?: string,
  details?: Record<string, unknown>
): SecurityAlert {
  return {
    id: generateAlertId(),
    severity,
    category,
    title,
    description,
    identifier,
    details,
    timestamp: Date.now(),
  };
}

// ============================================================
// ALERT CHANNELS
// ============================================================

/**
 * Log channel - always enabled
 */
const logChannel: AlertChannel = {
  name: 'log',
  enabled: true,
  send: async (alert: SecurityAlert): Promise<void> => {
    const logFn = alert.severity === 'emergency' || alert.severity === 'critical'
      ? logger.error
      : alert.severity === 'warning'
        ? logger.warn
        : logger.info;

    logFn(`[SECURITY ALERT] ${alert.title}`, {
      alertId: alert.id,
      severity: alert.severity,
      category: alert.category,
      description: alert.description,
      identifier: alert.identifier,
      details: alert.details,
    });
  },
};

/**
 * Email channel - for critical alerts in production
 * Uses Resend when configured
 */
const emailChannel: AlertChannel = {
  name: 'email',
  enabled: !isDevelopment && !!env.RESEND_API_KEY,
  send: async (alert: SecurityAlert): Promise<void> => {
    // Only send email for critical and emergency alerts
    if (alert.severity !== 'critical' && alert.severity !== 'emergency') {
      return;
    }

    if (!env.RESEND_API_KEY || !env.ALERT_EMAIL) {
      return;
    }

    try {
      // Dynamic import to avoid loading Resend if not configured
      // Use variable to prevent TypeScript from analyzing the import path
      const moduleName = 'resend';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resendModule = await import(/* webpackIgnore: true */ moduleName).catch(() => null) as any;
      if (!resendModule) {
        logger.warn('Resend module not available for email alerting');
        return;
      }

      const { Resend } = resendModule;
      const resend = new Resend(env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'VSG Security <security@visualsocialgraph.com>',
        to: env.ALERT_EMAIL,
        subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
        html: `
          <h2>Security Alert</h2>
          <p><strong>Severity:</strong> ${alert.severity}</p>
          <p><strong>Category:</strong> ${alert.category}</p>
          <p><strong>Description:</strong> ${alert.description}</p>
          ${alert.identifier ? `<p><strong>Identifier:</strong> ${alert.identifier}</p>` : ''}
          <p><strong>Time:</strong> ${new Date(alert.timestamp).toISOString()}</p>
          ${alert.details ? `<pre>${JSON.stringify(alert.details, null, 2)}</pre>` : ''}
        `,
      });

      logger.info('Security alert email sent', { alertId: alert.id });
    } catch (error) {
      logger.error('Failed to send security alert email', {
        alertId: alert.id,
        error: (error as Error).message,
      });
    }
  },
};

/**
 * Webhook channel - for external integrations (Slack, Discord, etc.)
 */
const webhookChannel: AlertChannel = {
  name: 'webhook',
  enabled: !!env.SECURITY_WEBHOOK_URL,
  send: async (alert: SecurityAlert): Promise<void> => {
    if (!env.SECURITY_WEBHOOK_URL) {
      return;
    }

    try {
      const response = await fetch(env.SECURITY_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `[${alert.severity.toUpperCase()}] ${alert.title}`,
          attachments: [
            {
              color: getAlertColor(alert.severity),
              fields: [
                { title: 'Category', value: alert.category, short: true },
                { title: 'Severity', value: alert.severity, short: true },
                { title: 'Description', value: alert.description },
                ...(alert.identifier ? [{ title: 'Identifier', value: alert.identifier }] : []),
              ],
              ts: Math.floor(alert.timestamp / 1000),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      logger.info('Security alert webhook sent', { alertId: alert.id });
    } catch (error) {
      logger.error('Failed to send security alert webhook', {
        alertId: alert.id,
        error: (error as Error).message,
      });
    }
  },
};

/**
 * Get alert color for Slack/Discord
 */
function getAlertColor(severity: AlertSeverity): string {
  switch (severity) {
    case 'emergency': return '#ff0000';
    case 'critical': return '#ff4444';
    case 'warning': return '#ffaa00';
    case 'info': return '#0088ff';
    default: return '#888888';
  }
}

// All channels
const channels: AlertChannel[] = [logChannel, emailChannel, webhookChannel];

// ============================================================
// ALERT SENDING
// ============================================================

/**
 * Send an alert through all enabled channels
 */
async function sendAlert(alert: SecurityAlert): Promise<void> {
  const enabledChannels = channels.filter(ch => ch.enabled);

  await Promise.allSettled(
    enabledChannels.map(channel => channel.send(alert))
  );
}

// ============================================================
// PUBLIC ALERTING FUNCTIONS
// ============================================================

/**
 * Alert on elevated threat score
 */
export async function alertThreatDetected(profile: ThreatProfile): Promise<void> {
  const severity: AlertSeverity =
    profile.score >= 90 ? 'emergency' :
    profile.score >= 70 ? 'critical' :
    'warning';

  const alert = createAlert(
    severity,
    'threat_detected',
    `High threat score detected: ${profile.score}`,
    `Identifier ${profile.identifier} has reached a threat score of ${profile.score}`,
    profile.identifier,
    {
      score: profile.score,
      signalCount: profile.signals.length,
      recentSignals: profile.signals.slice(-5).map(s => s.type),
    }
  );

  await sendAlert(alert);
}

/**
 * Alert on block action
 */
export async function alertBlockTriggered(entry: BlockEntry): Promise<void> {
  const severity: AlertSeverity = entry.type === 'permanent' ? 'critical' : 'warning';

  const alert = createAlert(
    severity,
    'block_triggered',
    `${entry.type === 'permanent' ? 'Permanent' : 'Temporary'} block triggered`,
    `${entry.identifier} has been blocked: ${entry.reason}`,
    entry.identifier,
    {
      type: entry.type,
      reason: entry.reason,
      details: entry.details,
      expiresAt: entry.expiresAt ? new Date(entry.expiresAt).toISOString() : 'never',
    }
  );

  await sendAlert(alert);
}

/**
 * Alert on attack pattern detection
 */
export async function alertAttackPattern(
  identifier: string,
  patternType: string,
  details: Record<string, unknown>
): Promise<void> {
  const alert = createAlert(
    'critical',
    'attack_pattern',
    `Attack pattern detected: ${patternType}`,
    `Potential attack attempt from ${identifier}`,
    identifier,
    details
  );

  await sendAlert(alert);
}

/**
 * Alert on rate limit exceeded
 */
export async function alertRateLimitExceeded(
  identifier: string,
  limit: number,
  actual: number
): Promise<void> {
  const alert = createAlert(
    'warning',
    'rate_limit_exceeded',
    'Rate limit exceeded',
    `${identifier} exceeded rate limit: ${actual}/${limit}`,
    identifier,
    { limit, actual }
  );

  await sendAlert(alert);
}

/**
 * Alert on authentication anomaly
 */
export async function alertAuthAnomaly(
  identifier: string,
  anomalyType: string,
  details: Record<string, unknown>
): Promise<void> {
  const alert = createAlert(
    'warning',
    'auth_anomaly',
    `Authentication anomaly: ${anomalyType}`,
    `Suspicious authentication activity from ${identifier}`,
    identifier,
    { anomalyType, ...details }
  );

  await sendAlert(alert);
}

/**
 * Alert on system security events
 */
export async function alertSystemSecurity(
  title: string,
  description: string,
  severity: AlertSeverity = 'critical',
  details?: Record<string, unknown>
): Promise<void> {
  const alert = createAlert(
    severity,
    'system_security',
    title,
    description,
    undefined,
    details
  );

  await sendAlert(alert);
}

export default {
  alertThreatDetected,
  alertBlockTriggered,
  alertAttackPattern,
  alertRateLimitExceeded,
  alertAuthAnomaly,
  alertSystemSecurity,
};
