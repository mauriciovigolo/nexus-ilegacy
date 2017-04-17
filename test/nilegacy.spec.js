'use strict';

const assert = require('assert');
const spawn = require('child_process').spawnSync;

describe('nilegacy', function() {
  describe('helping and info args', function() {
    it('No args: Should show usage options', function() {
      let result = spawn('node', ['./bin/nilegacy.js']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('USAGE:') > -1);
    });

    it('--help arg: Should show help', function() {
      let result = spawn('node', ['./bin/nilegacy.js', '--help']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('USAGE:') > -1);
    });


    it('-h arg: Should show help', function() {
      let result = spawn('node', ['./bin/nilegacy.js', '-h']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('USAGE:') > -1);
    });

    it('--version arg: Should show version', function() {
      let result = spawn('node', ['./bin/nilegacy.js', '--version']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('Nexus Legacy Importer - v') > -1);
    });

    it('-v arg: Should show version', function() {
      let result = spawn('node', ['./bin/nilegacy.js', '-v']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('Nexus Legacy Importer - v') > -1);
    });

    it('--examples arg: Should show examples', function() {
      let result = spawn('node', ['./bin/nilegacy.js', '--examples']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('Nexus Legacy Importer - Examples') > -1);
    });
  });
});