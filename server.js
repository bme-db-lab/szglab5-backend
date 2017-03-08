// third party
const http = require('http');
const express = require('express');
//
const config = require('./config/config.js');
const { port } = config.api;
const { initDB } = require('./db/db.js');

const addEndpoints = require('./endpoints');
initDB()
  .then(() => {
    console.log('Db initializing succeed!');
    const app = express();
    addEndpoints(app);
    // handle every other request
    app.use('/', (req ,res) => {
      console.log(req);
      res.status(404).send(`Endpoint not found: ${req.originalUrl}`);
    });

    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`API Server is listenning on localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(`Error during db initializing: ${err.message}`);
  });
