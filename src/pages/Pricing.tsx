import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { Switch } from '@/components/ui/Switch';
import { PricingCard } from '@/components/pricing/PricingCard';
import {
  BuildingOfficeIcon,
  CubeIcon,
  ShieldCheckIcon,
  CheckIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const advantages = [
  'AI-powered estimation accuracy up to 98%',
  'Comprehensive client and estimate management tools',
  'Seamless team collaboration features',
  'Custom reporting and template library',
  'Enterprise-grade security and compliance',
];

const plans = [
  {
    name: 'Basic',
    tagline: 'Get started with AI-driven estimation',
    price: '99',
    period: '/month',
    icon: BuildingOfficeIcon,
    description: 'Ideal for small teams and individual estimators.',
    features: [
      'AI-powered estimation tools',
      'Basic project analytics',
      'Up to 15 projects per month',
      'Standard templates',
      'Basic client management tools',
      'Email support',
      'Single user license',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    tagline: 'The complete estimation toolkit',
    price: '199',
    period: '/month',
    icon: CubeIcon,
    description: 'Best for growing construction businesses.',
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
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    tagline: 'Customized solutions for large organizations',
    price: 'Custom',
    period: '',
    icon: ShieldCheckIcon,
    description: 'Tailored for enterprise needs with personalized support.',
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
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'How does the 14-day free trial work?',
    answer:
      'Your free trial gives you full access to all features of the plan you choose. After 14 days, you can subscribe to continue using EffiBuild Pro.',
  },
  {
    question: 'Can I switch plans after signing up?',
    answer:
      'Absolutely! You can upgrade or downgrade your plan anytime. Changes will take effect immediately, and we’ll prorate any remaining balance.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, EffiBuild Pro uses enterprise-grade encryption and follows strict compliance standards to ensure your data is safe.',
  },
  {
    question: 'Do you offer support for annual billing?',
    answer:
      'Yes, all plans offer an annual billing option with a 20% discount. You can choose this option during checkout.',
  },
  {
    question: 'Can Enterprise customers request custom features?',
    answer:
      'Yes, Enterprise plans include custom integrations, workflows, and advanced analytics tailored to your organization’s needs.',
  },
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white">
      <Container className="py-24">
        {/* Header */}
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-base font-semibold leading-7 text-blue-600">Pricing</h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Flexible Plans for Every Business
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Select the plan that fits your needs and budget.
            </p>
          </div>
        </FadeIn>

        {/* Billing Toggle */}
        <FadeIn delay={0.1}>
          <div className="mt-8 flex items-center justify-center gap-x-4">
            <span className={`text-sm ${!isAnnual ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
              Monthly billing
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className={`text-sm ${isAnnual ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
              Annual billing
              <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                Save 20%
              </span>
            </span>
          </div>
        </FadeIn>

        {/* Why Choose EffiBuild Pro */}
        <FadeIn delay={0.2}>
          <div className="mt-16 mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Why Choose EffiBuild Pro?
            </h2>
            <ul className="mt-8 space-y-3 text-left">
              {advantages.map((advantage, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span className="text-gray-600">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <FadeIn key={plan.name} delay={index * 0.1}>
              <PricingCard plan={plan} isAnnual={isAnnual} />
            </FadeIn>
          ))}
        </div>

        {/* FAQs */}
        <FadeIn delay={0.4}>
          <div className="mx-auto max-w-2xl mt-24">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={faq.question} className="pt-6">
                  <dt>
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="flex w-full items-start justify-between text-left"
                    >
                      <span className="text-base font-semibold leading-7 text-gray-900">
                        {faq.question}
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        <ChevronDownIcon
                          className={`h-6 w-6 transform transition-transform duration-200 ${
                            openFaq === index ? 'rotate-180' : ''
                          }`}
                        />
                      </span>
                    </button>
                  </dt>
                  {openFaq === index && (
                    <motion.dd
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 pr-12"
                    >
                      <p className="text-base leading-7 text-gray-600">
                        {faq.answer}
                      </p>
                    </motion.dd>
                  )}
                </div>
              ))}
            </dl>
          </div>
        </FadeIn>

        {/* Final CTA */}
        <FadeIn delay={0.5}>
          <div className="mx-auto max-w-2xl text-center mt-24">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to transform your estimation process?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
