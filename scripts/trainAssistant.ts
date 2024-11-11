import { assistantTrainingService } from '@/services/assistantTrainingService';
import Logger from '@/lib/utils/logger';

async function trainAssistant() {
  try {
    Logger.info('Starting assistant training process');

    // Update assistant instructions
    Logger.info('Updating assistant instructions...');
    await assistantTrainingService.updateAssistantInstructions();

    // Upload training data
    Logger.info('Uploading training data...');
    await assistantTrainingService.uploadTrainingData();

    // Validate assistant
    Logger.info('Validating assistant...');
    await assistantTrainingService.validateAssistant();

    Logger.info('Assistant training completed successfully');
  } catch (error) {
    Logger.error('Assistant training failed:', error);
    process.exit(1);
  }
}

trainAssistant();