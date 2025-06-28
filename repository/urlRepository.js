const db = require('../db/db');

exports.save = async (shortId, originalUrl, expiry) => {
  const database = await db.connect();
  const urls = database.collection('urls');
  await urls.insertOne({
    shortId,
    originalUrl,
    created: new Date().toISOString(),
    expiry: expiry.toISOString(),
    visits: 0
  });
};

exports.find = async (shortId) => {
  const database = await db.connect();
  const urls = database.collection('urls');
  return await urls.findOne({ shortId });
};

exports.incrementVisits = async (shortId) => {
  const database = await db.connect();
  const urls = database.collection('urls');
  await urls.updateOne({ shortId }, { $inc: { visits: 1 } });
};

exports.getStats = async (shortId) => {
  const database = await db.connect();
  const urls = database.collection('urls');
  const entry = await urls.findOne({ shortId });
  if (entry) {
    return {
      visits: entry.visits,
      created: entry.created,
      expiry: entry.expiry,
      originalUrl: entry.originalUrl
    };
  }
  return null;
};