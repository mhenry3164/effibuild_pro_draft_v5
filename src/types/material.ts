export interface Material {
  id: string;
  lowesSku?: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  unitPrice: number;
  supplier: string;
  lastSync?: Date;
  priceHistory?: MaterialPriceHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MaterialPriceHistory {
  id: string;
  materialId: string;
  price: number;
  recordedAt: Date;
}