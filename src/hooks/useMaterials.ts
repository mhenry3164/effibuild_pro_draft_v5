import { useState } from 'react';
import axios from 'axios';
import type { Material } from '@/types';

interface UseMaterialsReturn {
  materials: Material[];
  isLoading: boolean;
  error: string | null;
  searchMaterials: (query: string, category?: string) => Promise<void>;
  getMaterial: (id: string) => Promise<Material>;
  getMaterialPriceHistory: (id: string, days?: number) => Promise<any[]>;
}

export function useMaterials(): UseMaterialsReturn {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMaterials = async (query: string, category?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ q: query });
      if (category) {
        params.append('category', category);
      }

      const response = await axios.get(`/api/materials/search?${params}`);
      setMaterials(response.data);
    } catch (err) {
      setError('Failed to search materials');
      console.error('Error searching materials:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMaterial = async (id: string): Promise<Material> => {
    try {
      const response = await axios.get(`/api/materials/${id}`);
      return response.data;
    } catch (err) {
      throw new Error('Failed to get material');
    }
  };

  const getMaterialPriceHistory = async (id: string, days: number = 30) => {
    try {
      const response = await axios.get(
        `/api/materials/${id}/price-history?days=${days}`
      );
      return response.data;
    } catch (err) {
      throw new Error('Failed to get price history');
    }
  };

  return {
    materials,
    isLoading,
    error,
    searchMaterials,
    getMaterial,
    getMaterialPriceHistory,
  };
}