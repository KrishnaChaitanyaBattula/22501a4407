const http = require('http');
const urlRoute = require('./route/urlRoute');
require('./cron_job/cleanupJob'); 

const server = http.createServer((req, res) => {
  urlRoute.handle(req, res);
});

server.listen(process.env.PORT, () => {
  console.log('URL shortener running on port 3000');
});