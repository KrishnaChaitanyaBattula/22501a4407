const http = require('http');
const urlRoute = require('./route/urlRoute');
require('./cron_job/cleanupJob');
const logger = require('./middleware/logger');

function applyMiddleware(req, res, middlewares, handler) {
  let idx = 0;
  function next() {
    if (idx < middlewares.length) {
      middlewares[idx++](req, res, next);
    } else {
      handler(req, res);
    }
  }
  next();
}

const server = http.createServer((req, res) => {
  applyMiddleware(req, res, [logger], urlRoute.handle);
});

server.listen(3000, () => {
  console.log('URL shortener running on port 3000');
});