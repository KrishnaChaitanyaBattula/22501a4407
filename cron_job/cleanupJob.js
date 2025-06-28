const db = require('../db/db');
const { CronJob } = require('cron');

const cleanupJob = new CronJob('*/10 * * * *', async () => {
  const database = await db.connect();
  const urls = database.collection('urls');
  const now = new Date().toISOString();
  await urls.deleteMany({ expiry: { $lt: now } });
});

cleanupJob.start();