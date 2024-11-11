import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import {
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  ChartPieIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  CubeTransparentIcon,
  DocumentChartBarIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'AI-Driven Estimation',
    description: 'Utilize cutting-edge AI technology to create precise construction estimates in minutes.',
    icon: ChartBarIcon,
    benefit: 'Save time with 70% faster estimates',
  },
  {
    name: 'Smart Assistant Integration',
    description: 'Access on-demand guidance and insights from a responsive AI assistant tailored for construction workflows.',
    icon: ChatBubbleBottomCenterTextIcon,
    benefit: '24/7 expert advice at your fingertips',
  },
  {
    name: 'Advanced Project Analytics',
    description: 'Leverage detailed analytics and predictive insights to optimize project outcomes and performance.',
    icon: ChartPieIcon,
    benefit: 'Empower decisions with data',
  },
  {
    name: 'Integrated Client Management',
    description: 'Simplify client interactions and maintain organized project histories with a centralized CRM.',
    icon: UserGroupIcon,
    benefit: 'Boost client satisfaction',
  },
  {
    name: 'Collaborative Tools',
    description: 'Enable real-time teamwork and communication across your project teams and stakeholders.',
    icon: ClockIcon,
    benefit: 'Enhance efficiency and collaboration',
  },
  {
    name: 'Unmatched Data Security',
    description: 'Ensure the safety of your business-critical data with top-tier security measures.',
    icon: ShieldCheckIcon,
    benefit: 'Protect your data with confidence',
  },
  {
    name: 'Material Optimization',
    description: 'Monitor material usage and identify cost-saving opportunities with intelligent suggestions.',
    icon: CubeTransparentIcon,
    benefit: 'Reduce material costs effectively',
  },
  {
    name: 'Customizable Reporting',
    description: 'Generate professional, customizable reports for estimates and analytics with ease.',
    icon: DocumentChartBarIcon,
    benefit: 'Present polished documentation',
  },
];

const comparisonData = [
  {
    feature: 'Estimation Time',
    effibuild: '15-30 minutes',
    traditional: '4-8 hours',
  },
  {
    feature: 'AI Guidance',
    effibuild: 'Real-time, tailored support',
    traditional: 'Manual and time-intensive',
  },
  {
    feature: 'Accuracy Rate',
    effibuild: '95-98%',
    traditional: '70-85%',
  },
  {
    feature: 'System Adaptability',
    effibuild: 'Learns and improves continuously',
    traditional: 'Rigid and manual',
  },
];

const faqs = [
  {
    question: 'How does EffiBuild Pro improve estimation accuracy?',
    answer: 'Our AI-powered platform learns from your historical project data, applies industry insights, and leverages advanced algorithms to deliver consistently accurate estimates.',
  },
  {
    question: 'Can EffiBuild Pro adapt to my business needs?',
    answer: 'Yes! Customize templates, workflows, and automation rules to fit your business model seamlessly.',
  },
  {
    question: 'What kind of support can I expect?',
    answer: 'We offer 24/7 AI assistant access, a dedicated support team, and comprehensive documentation for all users. Enterprise clients receive personalized account management.',
  },
  {
    question: 'Is my business data secure?',
    answer: 'Absolutely. We employ enterprise-grade encryption, routine security audits, and strict compliance with industry standards to protect your data.',
  },
];

export function Features() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Container className="py-24">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              Powerful Features
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Redefine Construction Estimation
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Unlock efficiency, accuracy, and insights with our AI-driven platform designed for construction professionals.
            </p>
          </div>
        </FadeIn>

        {/* Feature Cards */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FadeIn key={feature.name} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon
                      className="h-6 w-6 flex-none text-blue-600"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                    <p className="mt-6 text-sm font-medium text-blue-600">
                      {feature.benefit}
                    </p>
                  </dd>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
