import { useState } from 'react';
import { BlueprintUpload } from '@/components/takeoff/BlueprintUpload';
import { ProcessedResults } from '@/components/takeoff/ProcessedResults';
import { Alert } from '@/components/ui/Alert';
import { AlertCircle, Info } from 'lucide-react';
import type { ProcessedData } from '@/types';

export function TakeoffTool() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = (data: ProcessedData) => {
    setProcessedData(data);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setProcessedData(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blueprint Takeoff Tool</h1>
        <p className="text-gray-600">
          Upload your blueprints to automatically extract measurements and materials
        </p>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <div className="ml-2">
          <h3 className="font-medium">Development Notice</h3>
          <p className="text-sm">
            The Takeoff Tool requires a full server environment for PDF processing and OCR capabilities. 
            This feature will be fully functional when deployed to a production environment.
          </p>
        </div>
      </Alert>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <BlueprintUpload
            onUploadComplete={handleUploadComplete}
            onError={handleError}
          />
        </div>

        {processedData && (
          <div className="md:sticky md:top-24">
            <ProcessedResults data={processedData} />
          </div>
        )}
      </div>
    </div>
  );
}