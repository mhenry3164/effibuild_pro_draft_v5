import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { AlertCircle, FileText } from 'lucide-react';
import { generateEstimateFromBlueprint } from '@/services/estimateService';
import type { ProcessedData } from '@/types';

interface GenerateEstimateButtonProps {
  blueprintData: ProcessedData;
  projectId?: string;
  customerId?: string;
}

export function GenerateEstimateButton({
  blueprintData,
  projectId,
  customerId,
}: GenerateEstimateButtonProps) {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateEstimate = async () => {
    if (!projectId || !customerId) {
      setError('Project and customer information are required');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const estimate = await generateEstimateFromBlueprint({
        blueprintData,
        projectId,
        customerId,
      });

      navigate(`/dashboard/estimates/${estimate.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate estimate');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      <Button
        onClick={handleGenerateEstimate}
        disabled={isGenerating || !projectId || !customerId}
        className="w-full"
      >
        <FileText className="h-4 w-4 mr-2" />
        {isGenerating ? 'Generating Estimate...' : 'Generate Estimate'}
      </Button>

      {(!projectId || !customerId) && (
        <p className="text-sm text-gray-500 text-center">
          Please select a project and customer to generate an estimate
        </p>
      )}
    </div>
  );
}