var fm = require('file-matcher');
var spawn = require('child_process').spawnSync;
var Processor = require('./processors/processor');
var package = require('../package.json');

var print;
var exit;
var processor;


function NiLegacy(args) {
    print = console.log;
    exit = process.exit;

    loadProcessor(args);
}


function loadProcessor(args) {
    if (!args || args.length === 0 || args[0] === '-h' || args[0] === '--help') {
        help();
    }

    if (args[0] === '-v' || args[0] === '--version') {
        version();
    }

    var repo = args[0];
    if (repo !== 'maven' && repo !== 'node' && repo !== 'nuget') {
        print('nilegacy: Incorrect repository option: %s', repo);
        print('Valid repo keys: maven | node | nuget');
        print();
        print('Try "nilegacy --help" for more options');
        exit(1);
    }
    args.splice(0, 1);

    var indexRepoUrl = args.findIndex(value => value.indexOf('--repoUrl') > -1);
    if (indexRepoUrl === -1) {
        print('nilegacy: the "--repoUrl" option is required', repo);
        print();
        print('Try "nilegacy --help" for more options');
        exit(1);
    }
    var repoUrl = args.splice(indexRepoUrl, 1)[0];

    var indexRepoValue = repoUrl.indexOf('=');
    if (indexRepoValue === -1 || repoUrl.substr(++indexRepoValue, repoUrl.length).trim() === '') {
        print('nilegacy: "--repoUrl" value is not valid');
        print();
        print('Try "nilegacy --help" for more options');
        exit(1);
    }
    repoUrl = repoUrl.substr(indexRepoValue, repoUrl.length);

    if (repo !== 'maven') {
        if ((args.indexOf('--repositoryId') > -1) ||
            (args.indexOf('--generatePom') > -1) ||
            (args.indexOf('--groupId') > -1)) {
            print('nilegacy: "--repositoryId", "--generatePom" and "--groupId" options are restricted to the maven repository');
            print();
            print('Try "nilegacy --help" for more options');
            exit(1);
        }
    } else {
        if (args.indexOf('--repositoryId') > -1) {

        }
    }

}


function searchFiles(repo, dir) {
    var matcher = new fm.FileMatcher();

    var fileNamePattern;
    if (repo === 'maven') {
        fileNamePattern = '*.jar';
    } else if (repo === 'node') {
        fileNamePattern = ['package.json', '!node_modules'];
    } else if (repo === 'nuget') {

    }

    var criteria = {
        path: dir,
        recursiveSearch: true,
        fileFilter: {
            fileNamePattern: '**/*.jar'
        }
    };

    matcher.find(criteria)
        .then(function (files) {
            if (!files || files.length === 0) {
                console.log('No files found!');
                return;
            }

            for (var index = 0; index < files.length; index++) {
                var file = files[index];

                var result = spawn('mvn', args);

                if (result.status !== 0) {
                    console.log('File: ' + file, 'Output: ' + result.stdout);
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}


function help() {
    // repositoryId, generatePom, pomFile, groupId, version, artifactId
    print('USAGE: nilegacy [repo] [options] directory');
    print('');
    print('Repo:');
    print('%s\tspecify the type of repo (maven|node|nuget)', lPad('repo', 18));
    print('');
    print('Options:');
    print('%s\trepository URL', lPad('--repoUrl=', 18));
    print('%s\tshow the current version', lPad('--version', 18));
    print('%s\tdisplay this help', lPad('--help', 18));
    print();
    print('Options valid ONLY for Maven repo');
    print('%s\trepository ID as configured in Maven\'s settings.xml', lPad('--repositoryId=', 18));
    print('%s\ttrue to force the pom generation, otherwise, will use the same name of the jar file for the pom, just changing the extension.', lPad('--generatePom=', 18));
    print('%s\trepository URL. If none, will use the pom as ', lPad('--groupId=', 18));
    print('');
    print('Example:');
    print('nilegacy maven --repoUrl=http://localhost:8081/repository/maven-hosted --repositoryId=maven-localhost');

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


module.exports = NiLegacy;