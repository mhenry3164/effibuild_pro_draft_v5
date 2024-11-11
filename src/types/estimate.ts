import type { Material } from './material';

export interface EstimateMaterial {
  id: string;
  materialId: string;
  material?: Material;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  aiRecommended: boolean;
}

export interface EstimateLaborCost {
  id: string;
  projectType: string;
  hours: number;
  rate: number;
  complexityFactor: number;
  totalCost: number;
  notes?: string;
}

export interface Estimate {
  id: string;
  projectId: string;
  clientId: string;
  createdBy: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  totalMaterialsCost: number;
  totalLaborCost: number;
  markupPercentage: number;
  totalCost: number;
  notes?: string;
  pdfPath?: string;
  materials: EstimateMaterial[];
  laborCosts: EstimateLaborCost[];
  createdAt: Date;
  updatedAt: Date;
}