import cron from 'node-cron';
import { materialService } from '@/services/materialService';
import Logger from '@/lib/utils/logger';

// Run material sync every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    Logger.info('Starting scheduled material sync');
    await materialService.syncMaterials();
    Logger.info('Scheduled material sync completed');
  } catch (error) {
    Logger.error('Scheduled material sync failed:', error);
  }
});