import cron from 'node-cron';
import { softDeleteExpiredLinks } from '../helpers/softDeleteExpiredLinks';

// Run the job every day at 01:00 AM
cron.schedule('0 1 * * *', async () => {
    console.log('[Cron] Running daily soft delete job at 01:00 AM');
    await softDeleteExpiredLinks();
});
