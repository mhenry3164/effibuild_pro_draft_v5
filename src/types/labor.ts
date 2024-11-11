export interface LaborRate {
  id: string;
  projectType: string;
  baseRate: number;
  complexityFactors: {
    low: number;
    medium: number;
    high: number;
  };
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ComplexityLevel = 'low' | 'medium' | 'high';

export interface LaborCalculation {
  hours: number;
  rate: number;
  complexityFactor: number;
  totalCost: number;
  breakdown?: {
    baseHours: number;
    adjustments: Array<{
      factor: string;
      value: number;
    }>;
  };
}