/**
 * Email Service (Resend HTTP API)
 * @module services/email/EmailService
 *
 * Sends transactional email via Resend when RESEND_API_KEY is configured.
 * In development without a key, falls back to logging the message so the
 * flow remains testable from the console.
 */

import { env, isProduction } from '../../config/index.js';
import { logger } from '../../middleware/logger.js';

const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Error thrown when email delivery fails or is unavailable
 */
export class EmailDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailDeliveryError';
  }
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Low-level send via Resend REST API
 */
async function sendViaResend(options: SendEmailOptions): Promise<void> {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    logger.error('Resend API request failed', {
      status: response.status,
      body,
    });
    throw new EmailDeliveryError(`Email provider returned ${response.status}`);
  }
}

/**
 * Build the magic link email (HTML + plain text)
 */
function buildMagicLinkEmail(url: string, expiresInMinutes: number): { html: string; text: string } {
  const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#0b0f1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0f1a;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#111827;border-radius:12px;padding:40px 32px;">
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <span style="font-size:22px;font-weight:700;color:#e5e7eb;">Visual Social Graph</span>
              </td>
            </tr>
            <tr>
              <td style="color:#9ca3af;font-size:15px;line-height:1.6;padding-bottom:28px;" align="center">
                Click the button below to sign in. This link expires in <strong style="color:#e5e7eb;">${expiresInMinutes} minutes</strong> and can only be used once.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:28px;">
                <a href="${url}" style="display:inline-block;background-color:#6366f1;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:14px 32px;border-radius:8px;">
                  Sign in to Visual Social Graph
                </a>
              </td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:13px;line-height:1.6;" align="center">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${url}" style="color:#818cf8;word-break:break-all;">${url}</a>
              </td>
            </tr>
            <tr>
              <td style="color:#4b5563;font-size:12px;padding-top:28px;" align="center">
                If you didn't request this link, you can safely ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    'Sign in to Visual Social Graph',
    '',
    `Open this link to sign in (expires in ${expiresInMinutes} minutes, single use):`,
    url,
    '',
    "If you didn't request this link, you can safely ignore this email.",
  ].join('\n');

  return { html, text };
}

// ============================================================
// EMAIL SERVICE
// ============================================================

export const EmailService = {
  /**
   * Whether a real email provider is configured
   */
  isConfigured(): boolean {
    return Boolean(env.RESEND_API_KEY);
  },

  /**
   * Send a magic link sign-in email
   */
  async sendMagicLink(to: string, url: string, expiresInSeconds: number): Promise<void> {
    const expiresInMinutes = Math.max(1, Math.round(expiresInSeconds / 60));

    if (!this.isConfigured()) {
      if (isProduction) {
        // Never silently swallow auth email in production
        throw new EmailDeliveryError('Email service is not configured (RESEND_API_KEY missing)');
      }

      logger.info('RESEND_API_KEY not set - magic link logged instead of emailed (dev only)', {
        to,
        url,
      });
      return;
    }

    const { html, text } = buildMagicLinkEmail(url, expiresInMinutes);

    await sendViaResend({
      to,
      subject: 'Your sign-in link for Visual Social Graph',
      html,
      text,
    });

    logger.info('Magic link email sent', { to });
  },
};
