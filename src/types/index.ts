export interface Material {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  supplier: string;
  unit: string;
  unitPrice: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaterialPriceHistory {
  id: string;
  materialId: string;
  price: number;
  recordedAt: Date;
}

export interface EstimateMaterial extends Material {
  quantity: number;
  totalPrice: number;
  aiRecommended?: boolean;
}

export interface ProcessedData {
  id?: string;
  projectId?: string;
  customerId?: string;
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  materials: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
}