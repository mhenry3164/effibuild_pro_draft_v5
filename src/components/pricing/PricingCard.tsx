import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@heroicons/react/24/outline';
import type { PricingPlan } from '@/types/pricing';
import { motion } from 'framer-motion';

interface PricingCardProps {
  plan: PricingPlan;
  isAnnual: boolean;
}

export function PricingCard({ plan, isAnnual }: PricingCardProps) {
  const price = isAnnual 
    ? Math.floor(Number(plan.price.replace('$', '')) * 12 * 0.8)
    : plan.price;

  const Icon = plan.icon;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 ${
        plan.popular
          ? 'ring-2 ring-blue-600 scale-105'
          : ''
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
            Most Popular
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-x-4">
        <h3 className="text-lg font-semibold leading-8 text-gray-900">
          {plan.name}
        </h3>
        <Icon
          className="h-6 w-6 text-blue-600"
          aria-hidden="true"
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600">
        {plan.tagline}
      </p>

      <p className="mt-6 flex items-baseline gap-x-1">
        <span className="text-4xl font-bold tracking-tight text-gray-900">
          ${typeof price === 'string' ? price.replace('$', '') : price}
        </span>
        {plan.period && (
          <span className="text-sm font-semibold leading-6 text-gray-600">
            /{isAnnual ? 'year' : 'month'}
          </span>
        )}
      </p>

      <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-x-3">
            <CheckIcon
              className="h-6 w-5 flex-none text-blue-600"
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        asChild
        className="mt-8 w-full"
        variant={plan.popular ? 'default' : 'outline'}
      >
        <Link to={plan.cta === 'Contact Sales' ? '/contact' : '/register'}>
          {plan.cta}
        </Link>
      </Button>
    </motion.div>
  );
}