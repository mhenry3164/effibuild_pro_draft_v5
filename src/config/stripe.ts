export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  PRICES: {
    BASIC: 'price_basic',
    PROFESSIONAL: 'price_professional',
    ENTERPRISE: 'price_enterprise',
  },
  WEBHOOK_SECRET: import.meta.env.STRIPE_WEBHOOK_SECRET,
};

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 99,
    features: [
      'AI-powered estimation tools',
      'Basic project analytics',
      'Up to 15 projects per month',
      'Standard templates',
      'Basic client management tools',
      'Email support',
      'Single user license',
    ],
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    price: 199,
    features: [
      'Everything in Basic, plus:',
      'Advanced AI estimations',
      'Unlimited projects',
      'Customizable templates and reports',
      'Full project and client management',
      'Priority email and chat support',
      'Up to 5 user licenses',
      'Integrated knowledge base',
    ],
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Everything in Professional, plus:',
      'Custom AI model training',
      'Enterprise-grade analytics',
      'Dedicated account manager',
      'Custom integrations and workflows',
      'Onboarding and training',
      'Unlimited user licenses',
      'On-premise deployment options',
    ],
  },
};