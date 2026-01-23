/**
 * Webhook routes
 * @module routes/webhook
 */

import { Router, type Request, type Response, type NextFunction, type IRouter } from 'express';
import express from 'express';
import Stripe from 'stripe';
import { env } from '../config/index.js';
import { prisma } from '../config/database.js';
import { logger } from '../middleware/logger.js';

const router: IRouter = Router();

// Initialize Stripe if configured
const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' })
  : null;

// ============================================================
// STRIPE WEBHOOK
// ============================================================

/**
 * POST /webhooks/stripe
 * Handle Stripe webhook events
 */
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
      logger.warn('Stripe webhook called but Stripe is not configured');
      return res.status(503).json({ error: 'Stripe not configured' });
    }

    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      logger.error('Stripe webhook signature verification failed', {
        error: (err as Error).message,
      });
      return res.status(400).json({ error: 'Invalid signature' });
    }

    logger.info('Stripe webhook received', { type: event.type });

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionUpdate(subscription);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionDeleted(subscription);
          break;
        }

        case 'invoice.paid': {
          const invoice = event.data.object as Stripe.Invoice;
          await handleInvoicePaid(invoice);
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          await handlePaymentFailed(invoice);
          break;
        }

        default:
          logger.debug('Unhandled webhook event type', { type: event.type });
      }

      res.json({ received: true });
    } catch (error) {
      logger.error('Error processing Stripe webhook', {
        type: event.type,
        error: (error as Error).message,
      });
      // Return 200 to prevent Stripe from retrying
      res.json({ received: true, error: 'Processing error' });
    }
  }
);

// ============================================================
// WEBHOOK HANDLERS
// ============================================================

/**
 * Handle subscription created/updated
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const existingSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!existingSubscription) {
    logger.warn('Subscription update for unknown customer', { customerId });
    return;
  }

  // Determine tier based on price ID
  let tier: 'FREE' | 'PRO' | 'CREATOR' = 'FREE';
  const priceId = subscription.items.data[0]?.price.id;

  if (priceId === env.STRIPE_PRICE_PRO) {
    tier = 'PRO';
  } else if (priceId === env.STRIPE_PRICE_CREATOR) {
    tier = 'CREATOR';
  }

  // Map Stripe status to our status
  const statusMap: Record<Stripe.Subscription.Status, string> = {
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELED',
    unpaid: 'PAST_DUE',
    incomplete: 'INACTIVE',
    incomplete_expired: 'INACTIVE',
    trialing: 'TRIALING',
    paused: 'INACTIVE',
  };

  const status = statusMap[subscription.status] || 'INACTIVE';

  // Update subscription
  await prisma.subscription.update({
    where: { stripeCustomerId: customerId },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId ?? null,
      status: status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  // Update user tier
  await prisma.user.update({
    where: { id: existingSubscription.userId },
    data: { tier },
  });

  logger.info('Subscription updated', {
    userId: existingSubscription.userId,
    status,
    tier,
  });
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;

  const existingSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!existingSubscription) {
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { stripeCustomerId: customerId },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
    },
  });

  // Downgrade user to free tier
  await prisma.user.update({
    where: { id: existingSubscription.userId },
    data: { tier: 'FREE' },
  });

  logger.info('Subscription canceled', {
    userId: existingSubscription.userId,
  });
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  logger.info('Invoice paid', {
    invoiceId: invoice.id,
    customerId: invoice.customer,
    amount: invoice.amount_paid,
  });
}

/**
 * Handle failed invoice payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string;

  logger.warn('Invoice payment failed', {
    invoiceId: invoice.id,
    customerId,
  });

  // TODO: Send email notification to user
}

export default router;
