import { RocketIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export function ProjectManagement() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
        <p className="text-gray-600">Manage your construction projects</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <RocketIcon className="h-16 w-16 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Big Changes Coming Soon!</h2>
          <p className="text-gray-600 text-center max-w-md">
            We're building something amazing! Our new project management features will help you streamline your construction workflows and boost productivity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}