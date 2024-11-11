import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import {
  Lightbulb,
  Target,
  Award,
  Users,
  ArrowRight,
} from 'lucide-react';

const values = [
  {
    name: 'Efficiency',
    description: 'Empowering productivity through intelligent automation and AI-driven insights.',
    icon: Target,
  },
  {
    name: 'Excellence',
    description: 'Setting the benchmark for superior solutions in construction technology.',
    icon: Award,
  },
  {
    name: 'Innovation',
    description: 'Pioneering advancements that transform construction estimation processes.',
    icon: Lightbulb,
  },
  {
    name: 'Partnership',
    description: 'Fostering lasting relationships by prioritizing client success and growth.',
    icon: Users,
  },
];

export function About() {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <Container className="py-24">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              About EffiBuild Pro: Redefining Construction Estimation
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Combining AI innovation with industry expertise to revolutionize construction workflows.
            </p>
          </div>
        </FadeIn>

        {/* Mission Statement Section */}
        <FadeIn delay={0.1}>
          <div className="mt-24 rounded-3xl bg-gradient-to-b from-blue-50 to-white px-6 py-16 text-center sm:py-20 lg:px-8">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Our Mission
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                At EffiBuild Pro, we aim to empower construction professionals by blending advanced AI technology with practical, real-world expertise. Our mission is to streamline workflows, reduce inefficiencies, and enable data-driven success.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Values Section */}
        <FadeIn delay={0.2}>
          <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Our Core Values
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                These principles guide everything we do, ensuring our clients achieve excellence.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                {values.map((value) => (
                  <div key={value.name} className="flex flex-col items-center text-center">
                    <div className="mb-6 rounded-lg bg-blue-50 p-4">
                      <value.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <dt className="text-xl font-semibold leading-7 text-gray-900">
                      {value.name}
                    </dt>
                    <dd className="mt-4 text-base leading-7 text-gray-600">
                      {value.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </FadeIn>

        {/* Founder's Note Section */}
        <FadeIn delay={0.3}>
          <div className="mx-auto mt-24 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Founder's Note
            </h2>
            <div className="mt-6 rounded-2xl bg-gray-50 px-6 py-8 text-left">
              <p className="text-lg leading-8 text-gray-600">
                EffiBuild Pro was envisioned by industry veterans who understand the unique challenges faced by construction professionals. Our goal is to empower businesses with innovative tools that streamline estimation processes, ensuring unparalleled accuracy and efficiency. By bridging the gap between technology and construction expertise, we are driving a new era of operational excellence.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn delay={0.4}>
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Ready to Elevate Your Business?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join countless professionals who trust EffiBuild Pro to transform their workflows and drive success.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/features">Discover More</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
