const http = require('http');
const path = require('path');
const express = require('express');
const logger = require('./utils/logger.js');

const port = process.argv[2] || 7700;

const app = express();
app.use(express.static(path.join(__dirname, 'apidoc')));

const server = http.createServer(app);
server.listen(port, () => {
  logger.info(`Apidoc server is listening on localhost:${port}`);
});
