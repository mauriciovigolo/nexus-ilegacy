#!/usr/bin/env node

var MvnProcessor = require('../lib/processors/mvn.processor');

var processor = new MvnProcessor();
processor.isConfigured();

console.log(process.argv.slice(2));