import express from 'express';
import { stripeService } from '@/services/stripeService';
import { checkPermission } from '@/middleware/checkPermission';
import { db } from '@/lib/db';
import Logger from '@/lib/utils/logger';

const router = express.Router();

// Create Stripe customer
router.post(
  '/create-customer',
  checkPermission(['billing:manage']),
  async (req, res) => {
    try {
      const { clientId, email, name } = req.body;
      const customer = await stripeService.createCustomer(clientId, email, name);
      res.json(customer);
    } catch (error) {
      Logger.error('Failed to create customer:', error);
      res.status(500).json({ error: 'Failed to create customer' });
    }
  }
);

// Create subscription
router.post(
  '/subscribe',
  checkPermission(['billing:manage']),
  async (req, res) => {
    try {
      const { clientId, priceId, paymentMethodId } = req.body;
      const subscription = await stripeService.createSubscription(
        clientId,
        priceId,
        paymentMethodId
      );
      res.json(subscription);
    } catch (error) {
      Logger.error('Failed to create subscription:', error);
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  }
);

// Cancel subscription
router.post(
  '/cancel-subscription',
  checkPermission(['billing:manage']),
  async (req, res) => {
    try {
      const { subscriptionId } = req.body;
      const subscription = await stripeService.cancelSubscription(subscriptionId);
      res.json(subscription);
    } catch (error) {
      Logger.error('Failed to cancel subscription:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  }
);

// Create payment intent
router.post(
  '/create-payment-intent',
  checkPermission(['billing:manage']),
  async (req, res) => {
    try {
      const { amount, currency, clientId, metadata } = req.body;
      const paymentIntent = await stripeService.createPaymentIntent(
        amount,
        currency,
        clientId,
        metadata
      );
      res.json(paymentIntent);
    } catch (error) {
      Logger.error('Failed to create payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  }
);

// Get client's subscription
router.get(
  '/subscription/:clientId',
  checkPermission(['billing:read']),
  async (req, res) => {
    try {
      const [subscription] = await db.query(
        'SELECT * FROM subscriptions WHERE client_id = ? ORDER BY created_at DESC LIMIT 1',
        [req.params.clientId]
      );
      res.json(subscription || null);
    } catch (error) {
      Logger.error('Failed to fetch subscription:', error);
      res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  }
);

// Get client's invoices
router.get(
  '/invoices/:clientId',
  checkPermission(['billing:read']),
  async (req, res) => {
    try {
      const invoices = await db.query(
        'SELECT * FROM invoices WHERE client_id = ? ORDER BY created_at DESC',
        [req.params.clientId]
      );
      res.json(invoices);
    } catch (error) {
      Logger.error('Failed to fetch invoices:', error);
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  }
);

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature']!;
    const event = await stripeService.handleWebhook(
      sig,
      req.body,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    res.json({ received: true, type: event.type });
  } catch (error) {
    Logger.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

export default router;