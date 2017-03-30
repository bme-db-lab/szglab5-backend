const http = require('http');
const path = require('path');
const express = require('express');

const port = process.argv[2] || 7700;

const app = express();
app.use(express.static(path.join(__dirname, 'apidoc')));

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Apidoc server is listening on localhost:${port}`);
});
