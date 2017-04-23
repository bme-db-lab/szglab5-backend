#!/usr/bin/env node

module.exports = () => {
  const logger = require('../../utils/logger.js');
  const XLSX = require('xlsx');
  logger.info('Test command running...');

  const dataPath = 'db/seedData/hallgatok-minta.xlsx';
  const sheetName = 'Hallgatoi csoportbeosztas másol';
  const workbook = XLSX.readFile(dataPath);
  const worksheet = workbook.Sheets[sheetName];
  console.log(worksheet);
};
