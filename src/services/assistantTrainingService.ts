import OpenAI from 'openai';
import { OPENAI_ASSISTANT_ID } from '@/config/constants';
import { ASSISTANT_INSTRUCTIONS, MATERIAL_PREFERENCES, LABOR_RATES } from '@/config/assistantConfig';
import Logger from '@/lib/utils/logger';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class AssistantTrainingService {
  private assistantId = OPENAI_ASSISTANT_ID;

  async updateAssistantInstructions() {
    try {
      await openai.beta.assistants.update(this.assistantId, {
        instructions: ASSISTANT_INSTRUCTIONS,
        name: 'Pearson Construction Estimator',
        description: 'Construction estimation assistant for Pearson Construction',
      });

      Logger.info('Assistant instructions updated successfully');
    } catch (error) {
      Logger.error('Failed to update assistant instructions:', error);
      throw error;
    }
  }

  async uploadTrainingData() {
    try {
      // Create training files
      const trainingData = {
        materialPreferences: MATERIAL_PREFERENCES,
        laborRates: LABOR_RATES,
        sampleProjects: [
          {
            type: 'deck',
            dimensions: '16x20',
            materials: [
              { name: 'Pressure-treated 2x8', quantity: 22 },
              { name: 'Trex Composite Decking', quantity: 320 },
              { name: 'Simpson Strong-Tie Hardware', quantity: 48 },
            ],
            laborHours: 45,
            totalCost: 12500,
          },
          {
            type: 'foundation',
            dimensions: '24x36',
            materials: [
              { name: 'Ready-mix Concrete', quantity: 28 },
              { name: 'Rebar #4', quantity: 120 },
              { name: 'Form Boards', quantity: 32 },
            ],
            laborHours: 65,
            totalCost: 18750,
          },
        ],
      };

      const file = await openai.files.create({
        file: Buffer.from(JSON.stringify(trainingData, null, 2)),
        purpose: 'assistants',
      });

      // Attach file to assistant
      await openai.beta.assistants.files.create(this.assistantId, {
        file_id: file.id,
      });

      Logger.info('Training data uploaded successfully');
    } catch (error) {
      Logger.error('Failed to upload training data:', error);
      throw error;
    }
  }

  async validateAssistant() {
    try {
      const thread = await openai.beta.threads.create();

      // Test material recommendations
      await this.testMaterialRecommendations(thread.id);

      // Test labor calculations
      await this.testLaborCalculations(thread.id);

      // Test estimate generation
      await this.testEstimateGeneration(thread.id);

      Logger.info('Assistant validation completed successfully');
    } catch (error) {
      Logger.error('Assistant validation failed:', error);
      throw error;
    }
  }

  private async testMaterialRecommendations(threadId: string) {
    const message = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: 'What materials would you recommend for a 16x20 pressure-treated deck?',
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistantId,
    });

    await this.waitForRun(threadId, run.id);
  }

  private async testLaborCalculations(threadId: string) {
    const message = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: 'Calculate labor costs for a 24x36 foundation with medium complexity.',
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistantId,
    });

    await this.waitForRun(threadId, run.id);
  }

  private async testEstimateGeneration(threadId: string) {
    const message = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: 'Generate an estimate for a 16x20 deck with Trex composite decking.',
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistantId,
    });

    await this.waitForRun(threadId, run.id);
  }

  private async waitForRun(threadId: string, runId: string) {
    let run = await openai.beta.threads.runs.retrieve(threadId, runId);

    while (run.status === 'queued' || run.status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      run = await openai.beta.threads.runs.retrieve(threadId, runId);
    }

    if (run.status !== 'completed') {
      throw new Error(`Run failed with status: ${run.status}`);
    }

    const messages = await openai.beta.threads.messages.list(threadId);
    return messages.data[0];
  }
}

export const assistantTrainingService = new AssistantTrainingService();