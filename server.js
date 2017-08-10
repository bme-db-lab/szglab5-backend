// third party
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Prometheus = require("prometheus-client");
const client = new Prometheus();
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

    // Monitoring
    promEndpoint = express();
    promEndpoint.get('/metrics',client.metricsFunc());
    const memUsed = client.newGauge({ namespace: "performance", name: "memUsed", help: "Backend memory usage." });
    const monitoring = config.monitoring;
    setInterval(function() { memUsed.set({ period: monitoring.updateSec + "sec" }, process.memoryUsage().heapUsed); }, monitoring.updateSec * 1000);
    promEndpoint.listen(monitoring.port, () => {
      logger.info(`Monitoring endpoint is on localhost:${monitoring.port}/metrics`);
    });
  })
  .catch((err) => {
    logger.error(`Error during server initializing: ${err.message}`);
  });
