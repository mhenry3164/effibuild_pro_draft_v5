import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { AlertCircle } from 'lucide-react';
import { PaymentMethodForm } from './PaymentMethodForm';
import { SUBSCRIPTION_PLANS } from '@/config/stripe';

interface SubscriptionFormProps {
  clientId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SubscriptionForm({
  clientId,
  onSuccess,
  onCancel,
}: SubscriptionFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentForm(true);
  };

  const handlePaymentMethodSubmit = async (paymentMethodId: string) => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          planId: selectedPlan,
          paymentMethodId,
          isAnnual,
        }),
      });

      if (!response.ok) throw new Error('Failed to create subscription');

      const { clientSecret } = await response.json();

      if (stripe) {
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
        if (confirmError) {
          throw confirmError;
        }
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      {!showPaymentForm ? (
        <>
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-md ${
                !isAnnual
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-md ${
                isAnnual
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => (
              <div
                key={id}
                className={`rounded-lg border p-6 ${
                  selectedPlan === id
                    ? 'border-blue-600 ring-2 ring-blue-600'
                    : 'border-gray-200'
                }`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-4 text-3xl font-bold">
                  ${typeof plan.price === 'number'
                    ? isAnnual
                      ? Math.floor(plan.price * 12 * 0.8)
                      : plan.price
                    : plan.price}
                  {typeof plan.price === 'number' && (
                    <span className="text-sm font-normal text-gray-500">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  )}
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="ml-3 text-sm text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  onClick={() => handlePlanSelect(id)}
                  disabled={isProcessing}
                >
                  Select Plan
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Add Payment Method</h3>
          <PaymentMethodForm
            onSuccess={handlePaymentMethodSubmit}
            onCancel={() => setShowPaymentForm(false)}
          />
        </div>
      )}
    </div>
  );
}