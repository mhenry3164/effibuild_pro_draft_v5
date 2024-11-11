import { db } from '@/lib/db';
import Logger from '@/lib/utils/logger';

interface LaborRates {
  baseRate: number;
  complexityFactors: {
    low: number;
    medium: number;
    high: number;
  };
}

const DEFAULT_LABOR_RATES: LaborRates = {
  baseRate: 75, // Base hourly rate
  complexityFactors: {
    low: 1,
    medium: 1.3,
    high: 1.6,
  },
};

class LaborService {
  async calculateLabor(params: {
    projectType: string;
    area: number;
    complexity: 'low' | 'medium' | 'high';
    additionalFactors?: string[];
  }) {
    try {
      // Get labor rates from database or use defaults
      const rates = await this.getLaborRates(params.projectType);
      
      // Calculate base labor hours based on project type and area
      const baseHours = this.calculateBaseLaborHours(
        params.projectType,
        params.area
      );

      // Apply complexity factor
      const complexityFactor = rates.complexityFactors[params.complexity];
      const adjustedHours = baseHours * complexityFactor;

      // Apply additional factors if any
      const finalHours = this.applyAdditionalFactors(
        adjustedHours,
        params.additionalFactors
      );

      // Calculate total cost
      const totalCost = finalHours * rates.baseRate;

      return {
        laborHours: finalHours,
        hourlyRate: rates.baseRate,
        totalCost,
      };
    } catch (error) {
      Logger.error('Labor calculation error:', error);
      throw new Error('Failed to calculate labor costs');
    }
  }

  private async getLaborRates(projectType: string): Promise<LaborRates> {
    try {
      const [rates] = await db.query(
        'SELECT * FROM labor_rates WHERE project_type = ?',
        [projectType]
      );

      return rates || DEFAULT_LABOR_RATES;
    } catch (error) {
      Logger.error('Failed to get labor rates:', error);
      return DEFAULT_LABOR_RATES;
    }
  }

  private calculateBaseLaborHours(projectType: string, area: number): number {
    // This is a simplified calculation - in production, you'd want more sophisticated logic
    const hoursPerUnit = {
      foundation: 0.5,
      framing: 0.4,
      roofing: 0.3,
      drywall: 0.2,
      painting: 0.1,
    };

    return area * (hoursPerUnit[projectType as keyof typeof hoursPerUnit] || 0.3);
  }

  private applyAdditionalFactors(
    hours: number,
    factors?: string[]
  ): number {
    if (!factors?.length) return hours;

    // Apply factor adjustments based on specific conditions
    const factorAdjustments: Record<string, number> = {
      'difficult_access': 1.2,
      'height_work': 1.3,
      'weather_conditions': 1.15,
    };

    return factors.reduce((total, factor) => {
      const adjustment = factorAdjustments[factor] || 1;
      return total * adjustment;
    }, hours);
  }
}

export const laborService = new LaborService();