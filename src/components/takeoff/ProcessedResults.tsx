import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GenerateEstimateButton } from './GenerateEstimateButton';
import type { ProcessedData } from '@/types';

interface ProcessedResultsProps {
  data: ProcessedData;
}

export function ProcessedResults({ data }: ProcessedResultsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Blueprint Dimensions</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Width</dt>
              <dd className="text-lg">
                {data.dimensions.width} {data.dimensions.unit}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Height</dt>
              <dd className="text-lg">
                {data.dimensions.height} {data.dimensions.unit}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Recommended Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Material
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.materials.map((material, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {material.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {material.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {material.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {data.laborEstimate && (
        <Card>
          <CardHeader>
            <CardTitle>Labor Estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Hours</dt>
                <dd className="text-lg">{data.laborEstimate.hours}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Rate</dt>
                <dd className="text-lg">${data.laborEstimate.rate}/hr</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="text-lg">${data.laborEstimate.total}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      {data.aiRecommendations && data.aiRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {data.aiRecommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-600">
                  {recommendation}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <GenerateEstimateButton
        blueprintData={data}
        projectId={data.projectId}
        customerId={data.customerId}
      />
    </div>
  );
}