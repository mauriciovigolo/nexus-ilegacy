/**
 * @license
 * Copyright (c) 2017 Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/nexus-ilegacy/blob/master/LICENSE
 */
var fm = require('file-matcher');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawnSync;
var Processor = require('./processors/processor');
var chalk = require('chalk');
var package = require('../package.json');

var print;
var exit;
var processor;
var existsSync;
var accessSync;
var repoDir;
var repoOptions;

var info;
var warn;


function NiLegacy(args) {
  print = console.log;
  exit = process.exit;
  existsSync = fs.existsSync || path.existsSync;
  accessSync = fs.accessSync;

  info = chalk.yellow;
  warn = chalk.red;

  try {
    loadProcessorOptions(args);
    searchFiles()
      .then(files => {
        processor = new Processor(files, repoOptions);

        if (!processor.isConfigured()) {
          printError('%s was not found or configured. Checkout nexus-ilegacy docs for more info - https://github.com/mauriciovigolo/nexus-ilegacy/wiki', null, repoOptions.repo);
        }

        processor.importToNexus();
      })
      .catch(error => {
        printError(error);
      });
  } catch (error) {
    printError(error);
  }
}


function loadProcessorOptions(args) {
  if (!args || args.length === 0 || args[0] === '-h' || args[0] === '--help') {
    help();
  }

  if (args[0] === '-v' || args[0] === '--version') {
    version();
  }

  if (args[0] === '--examples') {
    examples();
  }

  var repo = args.shift();
  if (repo !== 'maven' && repo !== 'node' && repo !== 'nuget') {
    printError('Incorrect repository option: %s', 'Valid repo keys: maven | node | nuget', repo);
  }

  var repoUrl;
  var repositoryId;
  var generatePom;
  var groupId;
  var apiKey;
  var outputLogFile;

  while (args.length) {
    var arg = args.shift();

    switch (arg) {
      case '--repoUrl':
        repoUrl = args.shift();
        break;
      case '--repositoryId':
        repositoryId = args.shift();
        break;
      case '--generatePom':
        generatePom = true;
        break;
      case '--apiKey':
        apiKey = args.shift();
        break;
      case '--groupId':
        groupId = args.shift();
        break;
      case '--examples':
        printError('Invalid syntax. For examples type: nilegacy --examples');
        break;
      case '-h':
        printError('Invalid syntax. For help type: nilegacy --help');
        break;
      case '--help':
        printError('Invalid syntax. For help type: nilegacy --help');
        break;
      case '--output':
        outputLogFile = args.shift();
        if (!accessSync(outputLogFile)) {
          printError('User doesn\'t have permission to access %s', outputLogFile);
        }
        break;
      default:
        repoDir = arg;
        break;
    }
  }

  if (!repoUrl) {
    printError('the "--repoUrl" option is required');
  }

  if (!existsSync(repoDir)) {
    printError('Repository directory "%s" doesn\'t exist!', null, repoDir);
  }

  repoOptions = {
    repo: repo,
    repoUrl: repoUrl,
    outputLogFile: outputLogFile,
    groupId: groupId,
    generatePom: generatePom,
    repositoryId: repositoryId,
    apiKey: apiKey
  }

  if ((repo !== 'maven') && (repositoryId || generatePom || groupId)) {
    printError('"--repositoryId", "--generatePom" and "--groupId" options are restricted to the maven repository');
  } else if (!repositoryId) {
    printError('the "--repositoryId" argument is required for maven repo type');
  }

  if ((repo !== 'nuget') && (apiKey)) {
    printError('the "--apiKey" argument is restricted to the nuget repository');
  } else if (!apiKey) {
    printError('the "--apiKey" argument is required for nuget repo type');
  }
}


function searchFiles() {
  var matcher = new fm.FileMatcher();

  var fileNamePattern;
  if (repoOptions.repo === 'maven') {
    fileNamePattern = '**/**.jar';
  } else if (repoOptions.repo === 'node') {
    fileNamePattern = ['package.json', '!node_modules'];
  } else if (repoOptions.repo === 'nuget') {
    fileNamePattern = ['**/**.nupkg'];
  }

  var criteria = {
    path: repoDir,
    recursiveSearch: true,
    fileFilter: {
      fileNamePattern: fileNamePattern
    }
  };

  return new Promise((resolve, reject) => {
    matcher.find(criteria)
      .then(function (files) {
        if (!files || files.length === 0) {
          reject('No files found!');
        }

        resolve(files);
      })
      .catch(function (error) {
        reject('An error happened during file search');
      });
  });
}


function help() {
  print('Nexus Legacy Importer - Help');
  print('%s: nilegacy [repo] [options] directory', warn('USAGE'));
  print('');
  print('Repo:');
  print('%s\tspecify the type of repo (maven|node|nuget)', info(lPad('repo', 18)));
  print('');
  print('Options:');
  print('%s\trepository URL', info(lPad('--repoUrl', 18)));
  print('%s\tshow the current version', info(lPad('--version', 18)));
  print('%s\tdisplay this help', info(lPad('--help', 18)));
  print('%s\tchange the output log file. Default is ./nilegacy-YYYYMMDDHHmmss.log', info(lPad('--output', 18)));
  print('%s\tshows examples for maven, nuget and npm', info(lPad('--examples', 18)));
  print();
  print('Options valid ONLY for %s repo', warn('NuGet'));
  print('%s\tAPI Key for the nuget repo access', info(lPad('--apiKey', 18)));
  print();
  print('Options valid ONLY for %s repo', warn('Maven'));
  print('%s\trepository ID as configured in Maven\'s settings.xml', info(lPad('--repositoryId', 18)));
  print('%s\tif specified will force the pom generation, otherwise, will use the same name of the jar file for the pom', info(lPad('--generatePom', 18)));
  print('%s\tgroup ID must be informed if generatePom is true', info(lPad('--groupId', 18)));

  exit(0);
}


function examples() {
  print('Nexus Legacy Importer - Examples');
  print('');
  print(info('Maven'));
  print('nilegacy maven --repoUrl http://localhost:8081/repository/maven-hosted/ --repositoryId maven-localhost /home/user/maven_repo');
  print('%s Looks for *.jar files recursively and publish them in the specified repo', warn('what it does: '));
  print('');
  print(info('NPM'));
  print('nilegacy npm --repoUrl http://localhost:8081/repository/node-hosted/ /home/user/node_repo');
  print('%s Looks for package.json files recursively, not including node_modules files, and publish them in the specified repo', warn('what it does: '));
  print('');
  print(info('NuGet'));
  print('nilegacy nuget --repoUrl http://localhost:8081/repository/nuget-hosted/ --apiKey 47be3377-c434-4c29-8576-af7f6993a54b /home/user/nuget_repo');
  print('%s Looks for *.nupkg files recursively and publish them in the specified repo', warn('what it does: '));
  exit(0);
}


function version() {
  print('Nexus Legacy Importer - v%s', package.version);
  print('License under MIT. Copyright (c) 2017 Mauricio Gemelli Vigolo');

  exit(0);
}


function lPad(str, length) {
  if (str.length >= length) {
    return str;
  } else {
    return lPad(' ' + str, length);
  }
}


function printError(msg, details, args) {
  print('nilegacy: ' + msg, args || '');
  if (details) {
    print(details);
  }
  print();
  print('Try "nilegacy --help" for help and more options');
  exit(1);
}


module.exports = NiLegacy;