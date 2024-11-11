import Stripe from 'stripe';
import { db } from '@/lib/db';
import Logger from '@/lib/utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

class StripeService {
  async createCustomer(clientId: string, email: string, name: string) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          clientId,
        },
      });

      await db.query(
        `INSERT INTO billing_customers (
          client_id,
          stripe_customer_id
        ) VALUES (?, ?)`,
        [clientId, customer.id]
      );

      return customer;
    } catch (error) {
      Logger.error('Failed to create Stripe customer:', error);
      throw error;
    }
  }

  async createSubscription(
    clientId: string,
    priceId: string,
    paymentMethodId: string
  ) {
    try {
      const [customer] = await db.query(
        'SELECT stripe_customer_id FROM billing_customers WHERE client_id = ?',
        [clientId]
      );

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.stripe_customer_id,
      });

      // Set as default payment method
      await stripe.customers.update(customer.stripe_customer_id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.stripe_customer_id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      // Save subscription to database
      await db.query(
        `INSERT INTO subscriptions (
          client_id,
          stripe_subscription_id,
          plan_id,
          status,
          current_period_start,
          current_period_end
        ) VALUES (?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))`,
        [
          clientId,
          subscription.id,
          priceId,
          subscription.status,
          subscription.current_period_start,
          subscription.current_period_end,
        ]
      );

      return subscription;
    } catch (error) {
      Logger.error('Failed to create subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      await db.query(
        `UPDATE subscriptions 
         SET cancel_at_period_end = TRUE, updated_at = NOW()
         WHERE stripe_subscription_id = ?`,
        [subscriptionId]
      );

      return subscription;
    } catch (error) {
      Logger.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    clientId: string,
    metadata: Record<string, string> = {}
  ) {
    try {
      const [customer] = await db.query(
        'SELECT stripe_customer_id FROM billing_customers WHERE client_id = ?',
        [clientId]
      );

      if (!customer) {
        throw new Error('Customer not found');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        customer: customer.stripe_customer_id,
        metadata: {
          clientId,
          ...metadata,
        },
      });

      return paymentIntent;
    } catch (error) {
      Logger.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  async handleWebhook(
    signature: string,
    payload: Buffer,
    endpointSecret: string
  ) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;
      }

      return event;
    } catch (error) {
      Logger.error('Webhook error:', error);
      throw error;
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const { clientId } = paymentIntent.metadata;

    await db.query(
      `INSERT INTO invoices (
        client_id,
        stripe_invoice_id,
        amount_due,
        amount_paid,
        status
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        clientId,
        paymentIntent.id,
        paymentIntent.amount / 100,
        paymentIntent.amount / 100,
        'paid',
      ]
    );
  }

  private async handlePaymentFailure(invoice: Stripe.Invoice) {
    const [customer] = await db.query(
      'SELECT client_id FROM billing_customers WHERE stripe_customer_id = ?',
      [invoice.customer]
    );

    await db.query(
      `INSERT INTO invoices (
        client_id,
        stripe_invoice_id,
        amount_due,
        amount_paid,
        status
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        customer.client_id,
        invoice.id,
        invoice.amount_due / 100,
        invoice.amount_paid / 100,
        'failed',
      ]
    );
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    await db.query(
      `UPDATE subscriptions
       SET status = ?,
           current_period_start = FROM_UNIXTIME(?),
           current_period_end = FROM_UNIXTIME(?),
           updated_at = NOW()
       WHERE stripe_subscription_id = ?`,
      [
        subscription.status,
        subscription.current_period_start,
        subscription.current_period_end,
        subscription.id,
      ]
    );
  }
}

export const stripeService = new StripeService();