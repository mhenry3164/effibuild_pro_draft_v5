import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useMaterials } from '@/hooks/useMaterials';
import { MATERIAL_CATEGORIES } from '@/config/constants';
import type { Material } from '@/types';

interface MaterialSearchProps {
  onSelect: (material: Material) => void;
}

export function MaterialSearch({ onSelect }: MaterialSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { materials, isLoading, error, searchMaterials } = useMaterials();

  useEffect(() => {
    if (query.length >= 3) {
      const timer = setTimeout(() => {
        searchMaterials(query, selectedCategory || undefined);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [query, selectedCategory]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search materials..."
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {MATERIAL_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : materials.length > 0 ? (
          materials.map((material) => (
            <Card
              key={material.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(material)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{material.name}</h3>
                  <p className="text-sm text-gray-500">{material.description}</p>
                  <p className="text-sm text-gray-500">
                    SKU: {material.sku} | Category: {material.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${material.unitPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">per {material.unit}</p>
                </div>
              </div>
            </Card>
          ))
        ) : query.length >= 3 ? (
          <p className="text-sm text-gray-500">No materials found</p>
        ) : null}
      </div>
    </div>
  );
}