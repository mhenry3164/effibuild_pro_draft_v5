import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/Button';
import { X, File, Upload } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  files: File[];
  onRemove: (index: number) => void;
}

export function FileUpload({ onUpload, files, onRemove }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  if (files.length === 0) {
    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-6 w-6 mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop files here'
            : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supported: PDF, PNG, JPG (max 10MB)
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2"
        >
          <File className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">{file.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="p-1 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}