// third party
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
//
const config = require('./config/config.js');
const cors = require('cors');

const { port } = config.api;
const { initDB } = require('./db/db.js');
// const addEndpoints = require('./jsonapi');
const addEndpoints = require('./endpoints');
const addMiddlewares = require('./middlewares');
const logger = require('./utils/logger.js');

initDB()
  .then(() => {
    logger.info('Db initializing succeed!');
    const app = express();
    app.use(bodyParser.json({
      limit: '10mb',
      type: 'application/vnd.api+json'
    }));

    app.use(bodyParser.json({
      limit: '10mb',
      type: 'application/json'
    }));

    app.use(bodyParser.urlencoded({
      limit: '10mb',
      type: 'application/x-www-form-urlencoded',
      extended: false
    }));

    let whitelist = [];
    whitelist = config.cors.whitelist;
    if (config.env === 'dev') {
      const morgan = require('morgan');
      app.use(morgan('dev'));
    }
    const corsOptions = {
      origin: whitelist
    };
    app.use(cors(corsOptions));

    // app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
    addMiddlewares(app);
    addEndpoints(app);
    // handle every other request
    app.use('/', (req, res) => {
      const warnmsg = `Endpoint not found: ${req.method} ${req.originalUrl}`;
      logger.warn(warnmsg);
      res.status(404).send(warnmsg);
    });

    const server = http.createServer(app);
    server.listen(port, () => {
      logger.info(`API Server is listenning on localhost:${port}`);
    });
  })
  .catch((err) => {
    logger.error(`Error during server initializing: ${err.message}`);
  });
