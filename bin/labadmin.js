#!/usr/bin/env node

const cli = require('cli');
const seed = require('./commands/seedCmd.js');
const test = require('./commands/testCmd.js');

cli.parse(null, ['test', 'seed']);

console.log(`Command is: ${cli.command}`);

switch (cli.command) {
  case 'seed':
    seed();
    break;
  case 'test':
    test();
    break;
  default:
}
