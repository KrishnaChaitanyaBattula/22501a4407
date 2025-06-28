const urlHandler = require('../handler/urlHandler');

exports.handle = (req, res) => {
  if (req.method === 'POST' && req.url === '/shorten') {
    urlHandler.shorten(req, res);
  } else if (req.method === 'GET' && req.url.startsWith('/stats/')) {
    urlHandler.stats(req, res);
  } else if (req.method === 'GET' && /^\/[a-zA-Z0-9_-]+$/.test(req.url)) {
    urlHandler.redirect(req, res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
};