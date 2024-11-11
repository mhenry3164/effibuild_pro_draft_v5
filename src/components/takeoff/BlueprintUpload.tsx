import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { uploadBlueprint } from '@/services/blueprintService';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
};

interface BlueprintUploadProps {
  onUploadComplete: (data: any) => void;
  onError: (error: string) => void;
}

export function BlueprintUpload({ onUploadComplete, onError }: BlueprintUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      const error = 'File size exceeds 10MB limit';
      setUploadError(error);
      onError(error);
      return;
    }

    setUploadedFile(file);
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const data = await uploadBlueprint(file, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      setUploadProgress(100);
      onUploadComplete(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      setUploadError(message);
      onError(message);
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: isUploading,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-4">
      {uploadError && (
        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <span>{uploadError}</span>
        </Alert>
      )}

      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <div>
                  <p className="text-lg font-medium">Processing blueprint...</p>
                  <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                </div>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">
                  {isDragActive
                    ? 'Drop the blueprint here'
                    : 'Drag & drop your blueprint here'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  or click to select a file
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supported formats: PDF, PNG, JPG (max 10MB)
                </p>
              </>
            )}
          </div>
        </div>

        {uploadedFile && !isUploading && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {uploadedFile.type === 'application/pdf' ? (
                  <FileText className="h-6 w-6 text-red-500" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-blue-500" />
                )}
                <div>
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}