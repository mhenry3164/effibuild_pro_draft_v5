import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { Card, CardContent } from '@/components/ui/Card';
import { Brain, ChevronRight, Sparkles, Database, ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'Enhanced AI Estimation Models',
    description: 'Our latest AI models deliver up to 30% more accurate estimates by incorporating advanced machine learning algorithms and expanded construction data sets.',
    icon: Brain,
  },
  {
    title: 'Improved Natural Language Processing',
    description: 'Enhanced ability to understand and respond to complex project queries, making interaction with our AI assistant more natural and efficient.',
    icon: Sparkles,
  },
  {
    title: 'Client-Specific AI Training',
    description: 'New capabilities allowing the AI to learn from your historical data and adapt to your specific estimation patterns and preferences.',
    icon: Database,
  },
];

export function AIFeatures() {
  return (
    <div className="bg-white">
      <Container className="py-24">
        {/* Breadcrumb */}
        <FadeIn>
          <div className="flex items-center gap-x-3 text-sm mb-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <Link to="/updates" className="text-gray-600 hover:text-gray-900">
              Updates
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-900">AI Features</span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              New AI Features Released
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover our latest AI enhancements designed to make construction estimation more accurate and efficient than ever.
            </p>
          </div>
        </FadeIn>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Technical Details */}
        <FadeIn delay={0.2}>
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Technical Improvements
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-x-3">
                <span className="text-blue-600">•</span>
                <span className="text-gray-600">
                  Upgraded machine learning models with improved accuracy rates of up to 98%
                </span>
              </li>
              <li className="flex gap-x-3">
                <span className="text-blue-600">•</span>
                <span className="text-gray-600">
                  Enhanced natural language processing capabilities for better understanding of context
                </span>
              </li>
              <li className="flex gap-x-3">
                <span className="text-blue-600">•</span>
                <span className="text-gray-600">
                  Optimized response times for real-time estimation adjustments
                </span>
              </li>
            </ul>
          </div>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn delay={0.3}>
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Ready to Experience These New Features?
            </h2>
            <p className="mt-4 text-gray-600">
              Start using our enhanced AI capabilities today and see the difference in your estimation process.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Request Demo</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}