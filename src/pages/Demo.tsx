import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { Play, Phone } from 'lucide-react';

export function Demo() {
  return (
    <div className="bg-white">
      <Container className="py-24">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Demo Coming Soon!
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience how EffiBuild Pro revolutionizes construction estimation with AI-powered insights.
            </p>
          </div>
        </FadeIn>

        {/* Placeholder Video Section */}
        <FadeIn delay={0.1}>
          <div className="mt-16 aspect-video w-full max-w-4xl mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Product Demo Video</p>
            </div>
          </div>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn delay={0.2}>
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Want to see EffiBuild Pro in action?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Schedule a personalized demo with our team to explore how EffiBuild Pro can transform your estimation process.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact" className="inline-flex items-center">
                  Contact Sales for a Demo
                  <Phone className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/register">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}