import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  UserGroupIcon,
  ChartPieIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { TestimonialCarousel } from '@/components/marketing/TestimonialCarousel';
import { FadeIn } from '@/components/animations/FadeIn';

const features = [
  {
    name: 'AI-Powered Estimations',
    description: 'Harness the precision of AI to generate accurate construction estimates in minutes.',
    icon: ChartBarIcon,
    benefit: 'Cut estimation time by 70%',
  },
  {
    name: 'Smart Project Assistant',
    description: 'Receive instant insights and recommendations from our AI assistant, tailored to your project needs.',
    icon: ChatBubbleBottomCenterTextIcon,
    benefit: 'Expert guidance 24/7',
  },
  {
    name: 'Client Relationship Management',
    description: 'Organize and strengthen client relationships with centralized management tools.',
    icon: UserGroupIcon,
    benefit: 'Enhanced client satisfaction',
  },
  {
    name: 'Comprehensive Project Analytics',
    description: 'Leverage data insights to track performance and make informed business decisions.',
    icon: ChartPieIcon,
    benefit: 'Data-driven project success',
  },
];

const testimonials = [
  {
    quote: "EffiBuild Pro revolutionized our estimation process. We now generate precise estimates in hours, not days.",
    author: "Sarah Chen",
    role: "Project Manager",
    company: "BuildTech Solutions",
  },
  {
    quote: "The AI assistant has been a game-changer, providing on-demand expertise and improving our workflows dramatically.",
    author: "Michael Rodriguez",
    role: "Construction Director",
    company: "Premier Builders",
  },
];

export function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-blue-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <Container className="py-24 sm:py-32">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex space-x-6">
                <Link to="/updates" className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                  Latest Updates
                </Link>
                <Link to="/updates/ai" className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>New AI Features Released</span>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Revolutionize Your Estimation Process with EffiBuild Pro
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Empower your construction projects with cutting-edge AI. Reduce errors, save time, and enhance profitability with our intelligent and user-friendly platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Button asChild size="lg" className="text-lg px-8 py-6 sm:px-12">
                  <Link to="/features" className="inline-flex items-center">
                    Explore Features
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg">
                  <Link to="/demo">Watch Demo</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Rest of the component remains unchanged */}
      {/* Features section */}
      <Container className="py-24 sm:py-32">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              Unmatched Features
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need to Excel in Construction Estimation
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform integrates AI innovation with industry insights to streamline your entire workflow.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FadeIn key={feature.name} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="feature-card"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon
                      className="h-5 w-5 flex-none text-blue-600"
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

      {/* Testimonials */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600">
                Testimonials
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by Industry Experts
              </p>
            </div>
          </FadeIn>

          <div className="mx-auto mt-16 max-w-2xl lg:max-w-4xl">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </Container>
      </div>

      {/* CTA section */}
      <Container className="py-24 sm:py-32">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Take Your Estimation Process to the Next Level
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Thousands of professionals rely on EffiBuild Pro for faster, more accurate estimates. Join them today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
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