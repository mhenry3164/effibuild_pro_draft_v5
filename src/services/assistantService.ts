import OpenAI from 'openai';
import { materialService } from './materialService';
import { laborService } from './laborService';
import { estimateService } from './estimateService';
import { OPENAI_ASSISTANT_ID } from '@/config/constants';
import Logger from '@/lib/utils/logger';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface FetchMaterialsParams {
  categories: string[];
  projectDetails: {
    type: string;
    area: number;
    requirements?: string[];
  };
}

interface CalculateLaborParams {
  projectType: string;
  area: number;
  complexity: 'low' | 'medium' | 'high';
  additionalFactors?: string[];
}

interface GenerateEstimateParams {
  materials: Array<{
    id: string;
    quantity: number;
  }>;
  laborCost: number;
  projectDetails: {
    name: string;
    description: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
  };
}

class AssistantService {
  private assistantId = OPENAI_ASSISTANT_ID;

  private functionDefinitions = {
    fetchMaterials: {
      name: 'fetchMaterials',
      description: 'Fetch material options with prices for a construction project',
      parameters: {
        type: 'object',
        properties: {
          categories: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of material categories needed',
          },
          projectDetails: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              area: { type: 'number' },
              requirements: {
                type: 'array',
                items: { type: 'string' },
                optional: true,
              },
            },
          },
        },
        required: ['categories', 'projectDetails'],
      },
    },

    calculateLabor: {
      name: 'calculateLabor',
      description: 'Calculate labor hours and cost for a construction project',
      parameters: {
        type: 'object',
        properties: {
          projectType: { type: 'string' },
          area: { type: 'number' },
          complexity: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
          },
          additionalFactors: {
            type: 'array',
            items: { type: 'string' },
            optional: true,
          },
        },
        required: ['projectType', 'area', 'complexity'],
      },
    },

    generateEstimate: {
      name: 'generateEstimate',
      description: 'Generate a PDF estimate for a construction project',
      parameters: {
        type: 'object',
        properties: {
          materials: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                quantity: { type: 'number' },
              },
            },
          },
          laborCost: { type: 'number' },
          projectDetails: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              customer: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                },
              },
            },
          },
        },
        required: ['materials', 'laborCost', 'projectDetails'],
      },
    },
  };

  async initializeAssistant() {
    try {
      const assistant = await openai.beta.assistants.retrieve(this.assistantId);
      
      // Update assistant with function definitions
      await openai.beta.assistants.update(this.assistantId, {
        tools: [
          { type: 'function', function: this.functionDefinitions.fetchMaterials },
          { type: 'function', function: this.functionDefinitions.calculateLabor },
          { type: 'function', function: this.functionDefinitions.generateEstimate },
        ],
      });

      return assistant;
    } catch (error) {
      Logger.error('Failed to initialize assistant:', error);
      throw new Error('Failed to initialize assistant');
    }
  }

  async handleFunctionCall(
    functionName: string,
    parameters: any
  ): Promise<any> {
    try {
      switch (functionName) {
        case 'fetchMaterials':
          return await this.handleFetchMaterials(parameters);
        case 'calculateLabor':
          return await this.handleCalculateLabor(parameters);
        case 'generateEstimate':
          return await this.handleGenerateEstimate(parameters);
        default:
          throw new Error(`Unknown function: ${functionName}`);
      }
    } catch (error) {
      Logger.error(`Function call error (${functionName}):`, error);
      throw error;
    }
  }

  private async handleFetchMaterials(params: FetchMaterialsParams) {
    const materials = [];
    
    for (const category of params.categories) {
      const categoryMaterials = await materialService.searchMaterials(
        '',
        category
      );
      materials.push(...categoryMaterials);
    }

    return {
      materials: materials.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        category: m.category,
        unit: m.unit,
        unitPrice: m.unitPrice,
      })),
    };
  }

  private async handleCalculateLabor(params: CalculateLaborParams) {
    const {
      laborHours,
      hourlyRate,
      totalCost,
    } = await laborService.calculateLabor(params);

    return {
      laborHours,
      hourlyRate,
      totalCost,
      breakdown: {
        baseHours: laborHours,
        complexityFactor: params.complexity,
        additionalFactors: params.additionalFactors || [],
      },
    };
  }

  private async handleGenerateEstimate(params: GenerateEstimateParams) {
    const estimate = await estimateService.createEstimate({
      materials: params.materials,
      laborCost: params.laborCost,
      projectDetails: params.projectDetails,
    });

    const pdfUrl = await estimateService.generateEstimatePDF(estimate.id);

    return {
      estimateId: estimate.id,
      totalCost: estimate.totalCost,
      pdfUrl,
    };
  }
}

export const assistantService = new AssistantService();