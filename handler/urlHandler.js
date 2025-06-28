const urlService = require('../service/urlService');

exports.shorten = async (req, res) => {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', async () => {
    try {
      const { url, validity, shortcode } = JSON.parse(body);
      if (!url) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'url is required' }));
        return;
      }
      try {
        const { shortId, expiry } = await urlService.shorten(url, validity, shortcode);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          shortlink: `http://${req.headers.host}/${shortId}`,
          expiry
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid request body' }));
    }
  });
};

exports.redirect = async (req, res) => {
  const shortId = decodeURIComponent(req.url.slice(1));
  const originalUrl = await urlService.resolve(shortId);
  if (originalUrl) {
    res.writeHead(302, { Location: originalUrl });
    res.end();
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
};

exports.stats = async (req, res) => {
  const shortId = req.url.split('/')[2];
  const stats = await urlService.getStats(shortId);
  if (stats) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      shortcode: shortId,
      originalUrl: stats.originalUrl,
      created: stats.created,
      expiry: stats.expiry,
      visits: stats.visits
    }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
};