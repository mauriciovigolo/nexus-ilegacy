/**
 * @license
 * Copyright (c) 2017 Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/nexus-ilegacy/blob/master/LICENSE
 */
var spawn = require('child_process').spawnSync;
var fs = require('fs');
var moment = require('moment');
var Progress = require('progress');
var MvnProcessor = require('./mvn.processor');
var NpmProcessor = require('./npm.processor');
var NugetProcessor = require('./nuget.processor');
var os = require('os');

var processor;
var progressBar;
var filesToExecute;
var outputLogFile;

function Processor(files, repoOptions) {
  filesToExecute = files;

  outputLogFile = repoOptions.outputLogFile;
  if (!outputLogFile) {
    outputLogFile = `nilegacy-${moment().format('YYYYMMDDHHmmss')}.log`;
  }

  try {
    switch (repoOptions.repo) {
      case 'maven':
        processor = new MvnProcessor(repoOptions.repoUrl, repoOptions.repositoryId, repoOptions.generatePom, repoOptions.groupId);
        break;
      case 'npm':
        processor = new NpmProcessor(repoOptions.repoUrl);
        break;
      case 'nuget':
        processor = new NugetProcessor(repoOptions.repoUrl, repoOptions.apiKey);
        break;
    }
  } catch (error) {
    throw new Error(`The ${repoOptions.repo} processor could not be initialized`);
  }
}

Processor.prototype.importToNexus = function () {
  initializeProgressBar(filesToExecute.length);

  var errors = 0;
  var success = 0;

  var command = processor.getConfigValue('command');
  command = addWindowsSuffix(command);

  filesToExecute.forEach(file => {
    var msg;
    var args = processor.prepareSpawn(file);
    var result = spawn(command, args);

    if (result.status !== 0) {
      var osMsg = result.stderr ? result.stderr.toString() : undefined;
      if (!osMsg) {
        osMsg = result.stdout ? result.stdout.toString() : ' - ';
      }
      msg = `ERROR ${moment().format('YYYY-MM-DD HH:mm:ss')}: Repository uploading error for file: ${file}.\nDetails:\n${osMsg}`;
      errors += 1;
    } else {
      msg = `INFO ${moment().format('YYYY-MM-DD HH:mm:ss')}: File ${file} was successfully uploaded`;
      success += 1;
    }

    fs.appendFile(outputLogFile, msg, { encoding: 'utf8', flag: 'a' })

    progressBar.tick({
      success: success,
      errors: errors
    });
  });
}

Processor.prototype.isConfigured = function () {
  var command = processor.getConfigValue('command');
  command = addWindowsSuffix(command);
  var args = processor.getConfigValue('args');
  var result = spawn(command, [args.help]);

  return !result.error;
}

function addWindowsSuffix(command) {
  var commandSuffix = os.type().toLocaleLowerCase().indexOf('windows') > -1 ? '.cmd' : '';
  return command + commandSuffix;
}

function initializeProgressBar(total) {
  progressBar = new Progress(`  Nexus Import Progress [:bar] :percent | Eta: :eta s | Totals: success: :success | errors: :errors |`, {
    complete: '=',
    incomplete: '.',
    width: 20,
    total: total
  });
}


module.exports = Processor;