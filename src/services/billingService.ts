import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '@/config/stripe';
import type { Subscription, Invoice } from '@/types/billing';

const stripe = await loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY);

class BillingService {
  async createSubscription(priceId: string, paymentMethodId: string) {
    try {
      const response = await axios.post('/api/billing/subscribe', {
        priceId,
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create subscription');
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await axios.post('/api/billing/cancel-subscription', {
        subscriptionId,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to cancel subscription');
    }
  }

  async getSubscription(clientId: string): Promise<Subscription | null> {
    try {
      const response = await axios.get(`/api/billing/subscription/${clientId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch subscription');
    }
  }

  async getInvoices(clientId: string): Promise<Invoice[]> {
    try {
      const response = await axios.get(`/api/billing/invoices/${clientId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch invoices');
    }
  }

  async createPaymentMethod(element: any) {
    try {
      if (!stripe) throw new Error('Stripe not initialized');

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: element,
      });

      if (error) throw error;
      return paymentMethod;
    } catch (error) {
      throw new Error('Failed to create payment method');
    }
  }

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    try {
      const response = await axios.post('/api/billing/create-payment-intent', {
        amount,
        currency,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create payment intent');
    }
  }

  async confirmPayment(clientSecret: string, element: any) {
    try {
      if (!stripe) throw new Error('Stripe not initialized');

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: element,
          },
        }
      );

      if (error) throw error;
      return paymentIntent;
    } catch (error) {
      throw new Error('Payment failed');
    }
  }
}

export const billingService = new BillingService();