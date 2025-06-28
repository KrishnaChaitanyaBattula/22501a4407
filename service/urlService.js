const urlRepository = require('../repository/urlRepository');

exports.shorten = async (url, validity, shortcode) => {
  const minutes = validity && Number.isInteger(validity) ? validity : 30;
  const now = new Date();
  const expiryDate = new Date(now.getTime() + minutes * 60000);
  let shortId = shortcode;

  if (shortId) {
    const exists = await urlRepository.find(shortId);
    if (exists) {
      throw new Error('Shortcode already exists');
    }
  } else {
    shortId = Math.random().toString(36).substr(2, 6);
  }

  await urlRepository.save(shortId, url, expiryDate);
  return { shortId, expiry: expiryDate.toISOString() };
};

exports.resolve = async (shortId) => {
  const entry = await urlRepository.find(shortId);
  if (entry && new Date() < new Date(entry.expiry)) {
    await urlRepository.incrementVisits(shortId);
    return entry.originalUrl;
  }
  return null;
};

exports.getStats = async (shortId) => {
  const entry = await urlRepository.find(shortId);
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