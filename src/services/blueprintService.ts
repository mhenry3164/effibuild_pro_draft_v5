import axios from 'axios';
import { aiService } from './aiService';
import type { ProcessedData } from '@/types';

export async function uploadBlueprint(
  file: File,
  onProgress?: (progressEvent: ProgressEvent) => void
): Promise<ProcessedData> {
  const formData = new FormData();
  formData.append('blueprint', file);

  try {
    // First, upload and process the blueprint
    const response = await axios.post('/api/blueprints/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress ? 
        (progressEvent) => {
          onProgress(progressEvent as ProgressEvent);
        } : undefined,
    });

    const processedData = response.data;

    // Then, send to assistant for analysis
    const assistantResponse = await aiService.analyzeBlueprintData(
      processedData,
      file.name
    );

    // Combine OCR results with assistant's analysis
    return {
      ...processedData,
      materials: assistantResponse.materials,
      laborEstimate: assistantResponse.laborEstimate,
      aiRecommendations: assistantResponse.recommendations,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to upload blueprint');
    }
    throw error;
  }
}

export async function getBlueprint(id: string): Promise<ProcessedData> {
  try {
    const response = await axios.get(`/api/blueprints/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to retrieve blueprint');
    }
    throw error;
  }
}