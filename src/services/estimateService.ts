import axios from 'axios';
import type { ProcessedData, Estimate, EstimateMaterial } from '@/types';

interface GenerateEstimateParams {
  blueprintData: ProcessedData;
  projectId: string;
  customerId: string;
}

interface CreateEstimateData {
  projectId: string;
  customerId: string;
  blueprintId?: string;
  materials: EstimateMaterial[];
  notes?: string;
}

export async function generateEstimateFromBlueprint({
  blueprintData,
  projectId,
  customerId,
}: GenerateEstimateParams): Promise<Estimate> {
  try {
    // First, get AI recommendations for materials
    const response = await axios.post('/api/ai/recommend-materials', {
      blueprintData,
    });

    const recommendedMaterials = response.data.materials;

    // Create the estimate with recommended materials
    const estimate = await createEstimate({
      projectId,
      customerId,
      blueprintId: blueprintData.id,
      materials: recommendedMaterials,
      notes: 'Generated from blueprint analysis',
    });

    return estimate;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to generate estimate');
    }
    throw error;
  }
}

export async function createEstimate(data: CreateEstimateData): Promise<Estimate> {
  try {
    const response = await axios.post('/api/estimates', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to create estimate');
    }
    throw error;
  }
}

export async function updateEstimate(
  id: string,
  data: Partial<CreateEstimateData>
): Promise<Estimate> {
  try {
    const response = await axios.put(`/api/estimates/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to update estimate');
    }
    throw error;
  }
}

export async function getEstimate(id: string): Promise<Estimate> {
  try {
    const response = await axios.get(`/api/estimates/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to retrieve estimate');
    }
    throw error;
  }
}

export async function deleteEstimate(id: string): Promise<void> {
  try {
    await axios.delete(`/api/estimates/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to delete estimate');
    }
    throw error;
  }
}

export async function generateEstimatePDF(id: string): Promise<Blob> {
  try {
    const response = await axios.get(`/api/estimates/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to generate PDF');
    }
    throw error;
  }
}