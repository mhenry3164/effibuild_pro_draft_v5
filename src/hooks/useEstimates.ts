import { useState } from 'react';
import axios from 'axios';
import type { Estimate, EstimateItem } from '@/types';

interface UseEstimatesReturn {
  estimates: Estimate[];
  isLoading: boolean;
  error: string | null;
  fetchEstimates: (projectId?: string) => Promise<void>;
  createEstimate: (estimateData: CreateEstimateData) => Promise<void>;
  updateEstimate: (id: string, estimateData: UpdateEstimateData) => Promise<void>;
  deleteEstimate: (id: string) => Promise<void>;
}

interface CreateEstimateData {
  projectId: string;
  status?: 'draft' | 'sent' | 'approved' | 'rejected';
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface UpdateEstimateData {
  status?: 'draft' | 'sent' | 'approved' | 'rejected';
  items?: Array<{
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export function useEstimates(): UseEstimatesReturn {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstimates = async (projectId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = projectId ? { projectId } : {};
      const response = await axios.get('/api/estimates', { params });
      setEstimates(response.data);
    } catch (err) {
      setError('Failed to fetch estimates');
      console.error('Error fetching estimates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createEstimate = async (estimateData: CreateEstimateData) => {
    setError(null);
    try {
      const response = await axios.post('/api/estimates', estimateData);
      setEstimates(prevEstimates => [...prevEstimates, response.data]);
    } catch (err) {
      setError('Failed to create estimate');
      console.error('Error creating estimate:', err);
      throw err;
    }
  };

  const updateEstimate = async (id: string, estimateData: UpdateEstimateData) => {
    setError(null);
    try {
      const response = await axios.put(`/api/estimates/${id}`, estimateData);
      setEstimates(prevEstimates =>
        prevEstimates.map(estimate => (estimate.id === id ? response.data : estimate))
      );
    } catch (err) {
      setError('Failed to update estimate');
      console.error('Error updating estimate:', err);
      throw err;
    }
  };

  const deleteEstimate = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/estimates/${id}`);
      setEstimates(prevEstimates => prevEstimates.filter(estimate => estimate.id !== id));
    } catch (err) {
      setError('Failed to delete estimate');
      console.error('Error deleting estimate:', err);
      throw err;
    }
  };

  return {
    estimates,
    isLoading,
    error,
    fetchEstimates,
    createEstimate,
    updateEstimate,
    deleteEstimate,
  };
}