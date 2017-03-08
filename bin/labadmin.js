#!/usr/bin/env node

const method = process.argv[2];

// SEED
if (method === 'seed') {
  const { initDB } = require('../db/db.js');
  const seed = require('../db/seed.js');
  initDB({
    force: true
  })
  .then(seed)
  .then(() => {
    console.log('Seed succeed!');
  })
  .catch((err) =>  {
    console.log(`Seed failed: ${err.message}`);
  });
} else {
  console.log(`Not supported method: ${method}`);
}
