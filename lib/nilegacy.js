var fm = require('file-matcher');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawnSync;
var Processor = require('./processors/processor');
var package = require('../package.json');

var print;
var exit;
var processor;
var existsSync;
var accessSync;
var repoDir;
var repoOptions;



function NiLegacy(args) {
    print = console.log;
    exit = process.exit;
    existsSync = fs.existsSync || path.existsSync;
    accessSync = fs.accessSync;

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

    var repo = args.shift();
    if (repo !== 'maven' && repo !== 'node' && repo !== 'nuget') {
        printError('Incorrect repository option: %s', 'Valid repo keys: maven | node | nuget', repo);
    }

    var repoUrl;
    var repositoryId;
    var generatePom;
    var verboseMode;
    var groupId;
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
            case '--groupId':
                groupId = args.shift();
                break;
            case '--verbose':
                verboseMode = true;
                break;
            case '--output':
                outputLogFile = args.shift();
                if (!accessSync(outputLogFile)){
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
        verboseMode: verboseMode
    }

    if (repo === 'maven') {
        if (!repositoryId) {
            printError('the "--repositoryId" argument is required for maven repo type');
        }

        repoOptions.groupId = groupId;
        repoOptions.generatePom = generatePom;
        repoOptions.repositoryId = repositoryId;
    } else {
        if (repositoryId || generatePom || groupId) {
            printError('"--repositoryId", "--generatePom" and "--groupId" options are restricted to the maven repository');
        }
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
    print('USAGE: nilegacy [repo] [options] directory');
    print('');
    print('Repo:');
    print('%s\tspecify the type of repo (maven|node|nuget)', lPad('repo', 18));
    print('');
    print('Options:');
    print('%s\trepository URL', lPad('--repoUrl', 18));
    print('%s\tshow the current version', lPad('--version', 18));
    print('%s\tdisplay this help', lPad('--help', 18));
    print('%s\tchange the output log file. Default is ./nilegacy-YYYYMMDDHHmmss.log', lPad('--output', 18));
    print('%s\tverbose mode', lPad('--verbose', 18));
    print();
    print('Options valid ONLY for Maven repo');
    print('%s\trepository ID as configured in Maven\'s settings.xml', lPad('--repositoryId', 18));
    print('%s\tif specified will force the pom generation, otherwise, will use the same name of the jar file for the pom', lPad('--generatePom', 18));
    print('%s\tgroup ID must be informed if generatePom is true', lPad('--groupId', 18));
    print('');
    print('Example:');
    print('nilegacy maven --repoUrl http://localhost:8081/repository/maven-hosted --repositoryId maven-localhost /home/user/maven_repo');

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