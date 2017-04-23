#!/usr/bin/env node

/* const method = process.argv[2];
if (!method) {
  console.log('Please specify the method, with process arguments!');
  process.exit();
}*/

module.exports = () => {
    const { initDB } = require('../../db/db.js');
    const seed = require('../../db/seed.js');
    initDB({
      force: true
    })
    .then(seed)
    .then(() => {
      console.log('Seed succeed!');
    })
    .catch((err) => {
      console.log(`Seed failed: ${err.message}`);
    });
}
