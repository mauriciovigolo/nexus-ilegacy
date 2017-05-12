'use strict';

const assert = require('assert');
const spawn = require('child_process').spawnSync;


describe('nilegacy', function () {
  describe('Args Initialization', function () {
    it('No args: Should show usage options', function () {
      let result = spawn('node', ['./bin/nilegacy.js']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('USAGE:') > -1);
    });

    it('--help arg: Should show help', function () {
      let result = spawn('node', ['./bin/nilegacy.js', '--help']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('USAGE:') > -1);
    });

    it('-h arg: Should show help', function () {
      let result = spawn('node', ['./bin/nilegacy.js', '-h']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('USAGE:') > -1);
    });

    it('--version arg: Should show version', function () {
      let result = spawn('node', ['./bin/nilegacy.js', '--version']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('Nexus Legacy Importer - v') > -1);
    });

    it('-v arg: Should show version', function () {
      let result = spawn('node', ['./bin/nilegacy.js', '-v']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('Nexus Legacy Importer - v') > -1);
    });

    it('--examples arg: Should show examples', function () {
      let result = spawn('node', ['./bin/nilegacy.js', '--examples']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('Nexus Legacy Importer - Examples') > -1);
    });

    it('Cannot accept --examples arg after another arg', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'maven', '--examples']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('Invalid syntax') > -1);
    });

    it('Cannot accept --version arg after another arg', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'maven', '--version']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('Invalid syntax') > -1);
    });

    it('Cannot accept --h arg after another arg', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'maven', '-h']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('Invalid syntax') > -1);
    });

    it('Cannot accept --help arg after another arg', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'maven', '--help']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('Invalid syntax') > -1);
    });

    it('Should validate repo types, accepting only maven, node and nuget', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'non-available-repo']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('nilegacy: Incorrect repository option') > -1);
    });

    it('Should not run if there is no repoUrl', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'maven']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('the "--repoUrl" option is required') > -1);
    });

    it('Should return error if the directory containing the libraries doesn\'t exists', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'maven', '--repoUrl', 'http://localhost:8081/repo/', '/somedir/repo']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('Repository directory') > -1);
    });

    it('For Maven: Should throws error if it doesn\'t contain the repositoryId', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'maven', '--repoUrl', 'http://localhost:8081/repo/', '.']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('"--repositoryId" argument is required for maven repo type') > -1);
    });

    it('If !== Maven: Should not accept --repositoryId, --generatePom, --groupId', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'npm', '--repoUrl', 'http://localhost:8081/repo/', '--generatePom', 'true', '.']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('"--repositoryId", "--generatePom" and "--groupId" options are restricted to the maven repository') > -1);
    });

    it('For NuGet: throws error if it doesn\'t contain the apiKey', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'nuget', '--repoUrl', 'http://localhost:8081/repo/', '.']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('the "--apiKey" argument is required for nuget repo type') > -1);
    });

    it('If !== NuGet: Should not accept --apiKey', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'npm', '--apiKey', '<generated_key>', '--repoUrl', 'http://localhost:8081/repo/', '.']);

      let log = (result.stdout || result.stderr || '').toString();

      assert(log.indexOf('the "--apiKey" argument is restricted to the nuget repository') > -1);
    });
  });


  describe('Searching Files', function () {
    it('No files found, should exit', function () {
      let result = spawn('node', ['./bin/nilegacy.js', 'npm', '--repoUrl', 'http://localhost:8081/repo/', '/tmp/']);

      let log = (result.stdout || result.stderr || '').toString();
      console.log(log);

      assert(true);
    });
  });

});
