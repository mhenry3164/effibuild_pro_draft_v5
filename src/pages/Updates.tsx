import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react';

const updates = [
  {
    id: 1,
    title: 'Version 2.0 Released',
    date: 'November 8, 2023',
    description: 'Major platform update introducing enhanced UI, improved performance, and new collaboration features.',
    category: 'Release',
    link: '/updates/v2',
  },
  {
    id: 2,
    title: 'AI Enhancements for Estimation',
    date: 'November 1, 2023',
    description: 'Significant improvements to our AI estimation engine, delivering even more accurate results.',
    category: 'AI',
    link: '/updates/ai',
  },
  {
    id: 3,
    title: 'Expanded Client Management Features',
    date: 'October 25, 2023',
    description: 'New tools and capabilities for managing client relationships and project histories.',
    category: 'Feature',
    link: '/updates/client-management',
  },
];

const categories = [
  { name: 'All Updates', count: 12 },
  { name: 'AI Features', count: 5 },
  { name: 'Platform Updates', count: 4 },
  { name: 'New Features', count: 3 },
];

export function Updates() {
  return (
    <div className="bg-white">
      <Container className="py-24">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center gap-x-3 text-sm mb-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-900">Updates</span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Latest Updates
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Stay informed about the latest improvements and features we're adding to EffiBuild Pro.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-4">
          {/* Filters */}
          <FadeIn className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="font-semibold text-gray-900">Categories</h2>
              <ul className="mt-4 space-y-4">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button className="flex items-center justify-between w-full text-left">
                      <span className="text-sm text-gray-600 hover:text-gray-900">
                        {category.name}
                      </span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Updates List */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {updates.map((update, index) => (
                <FadeIn key={update.id} delay={index * 0.1}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-x-4 text-xs mb-4">
                        <time dateTime={update.date} className="text-gray-500">
                          <Calendar className="h-4 w-4 inline-block mr-1" />
                          {update.date}
                        </time>
                        <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                          {update.category}
                        </span>
                      </div>
                      <div className="group relative">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                          <Link to={update.link}>
                            <span className="absolute inset-0" />
                            {update.title}
                          </Link>
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          {update.description}
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button asChild variant="link" className="p-0">
                          <Link to={update.link} className="flex items-center">
                            Read more
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}