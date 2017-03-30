var spawn = require('child_process').spawnSync;
var fs = require('fs');
var moment = require('moment');
var Progress = require('progress');
var MvnProcessor = require('./mvn.processor');
var NpmProcessor = require('./npm.processor');
var NugetProcessor = require('./nuget.processor');


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
                processor = new NpmProcessor();
                break;
            case 'nuget':
                processor = new NugetProcessor();
                break;
        }
    } catch (error) {
        throw new Error(`The ${repoOptions.repo} processor could not be initialized`);
    }
}



Processor.prototype.importToNexus = function () {
    initializeProgressBar(filesToExecute.length);

    filesToExecute.forEach((file, index) => {
        var msg;

        try {
            var result = spawn(processor.getConfigValue('command'), processor.getArgs(file));

            if (result.status !== 0) {
                msg = `ERROR ${moment().format('YYYY-MM-DD HH:mm:ss')}: Repository uploading error for file: ${file}.\nstdout details\n${result.stdout}`;
            } else {
                msg = `INFO ${moment().format('YYYY-MM-DD HH:mm:ss')}: File ${file} was successfully uploaded`;
            }

        } catch (e) {
            msg = `ERROR ${moment().format('YYYY-MM-DD HH:mm:ss')}: Repository uploading error for file: ${file}.\nDetails: ${e}`;
        }

        fs.appendFile(outputLogFile, msg, { encoding: 'utf8', flag: 'a' })
    });
}



Processor.prototype.isConfigured = function () {
    var command = processor.getConfigValue('command');

    var result = spawn(command);

    return !result.error;
}


function initializeProgressBar(total) {
    progressBar = new Progress('  nexus import progress [:bar] :percent :etas', {
        complete: '=',
        incomplete: '.',
        width: 30,
        total: total
    });
}


module.exports = Processor;