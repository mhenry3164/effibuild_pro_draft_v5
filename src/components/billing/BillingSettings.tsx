import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { AlertCircle, CreditCard, Download } from 'lucide-react';
import { PaymentMethodForm } from './PaymentMethodForm';
import { billingService } from '@/services/billingService';
import { STRIPE_CONFIG } from '@/config/stripe';
import type { Subscription, Invoice, PaymentMethod } from '@/types/billing';

const stripePromise = loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY);

interface BillingSettingsProps {
  clientId: string;
}

export function BillingSettings({ clientId }: BillingSettingsProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddPayment, setShowAddPayment] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, [clientId]);

  const loadBillingData = async () => {
    try {
      const [sub, methods, invs] = await Promise.all([
        billingService.getSubscription(clientId),
        billingService.getPaymentMethods(clientId),
        billingService.getInvoices(clientId),
      ]);
      setSubscription(sub);
      setPaymentMethods(methods);
      setInvoices(invs);
    } catch (err) {
      setError('Failed to load billing information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPaymentMethod = async (paymentMethodId: string) => {
    try {
      await billingService.addPaymentMethod(clientId, paymentMethodId);
      setShowAddPayment(false);
      await loadBillingData();
    } catch (err) {
      setError('Failed to add payment method');
    }
  };

  const handleSetDefaultPayment = async (paymentMethodId: string) => {
    try {
      await billingService.setDefaultPaymentMethod(clientId, paymentMethodId);
      await loadBillingData();
    } catch (err) {
      setError('Failed to update default payment method');
    }
  };

  const handleRemovePayment = async (paymentMethodId: string) => {
    if (!window.confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    try {
      await billingService.removePaymentMethod(clientId, paymentMethodId);
      await loadBillingData();
    } catch (err) {
      setError('Failed to remove payment method');
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription || !window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      await billingService.cancelSubscription(subscription.id);
      await loadBillingData();
    } catch (err) {
      setError('Failed to cancel subscription');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div>
              <p className="text-lg font-medium">
                {subscription.planId} Plan
              </p>
              <p className="text-sm text-gray-500">
                Next billing date:{' '}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
              {subscription.cancelAtPeriodEnd ? (
                <p className="mt-2 text-sm text-red-600">
                  Your subscription will end on{' '}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              ) : (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No active subscription</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      •••• {method.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires {method.expMonth}/{method.expYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefaultPayment(method.id)}
                    >
                      Make Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemovePayment(method.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {showAddPayment ? (
              <Elements stripe={stripePromise}>
                <PaymentMethodForm
                  onSuccess={handleAddPaymentMethod}
                  onCancel={() => setShowAddPayment(false)}
                />
              </Elements>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowAddPayment(true)}
              >
                Add Payment Method
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ${invoice.amountDue.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {invoice.invoicePdf && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(invoice.invoicePdf, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}