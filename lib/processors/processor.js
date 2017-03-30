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

    var errors = 0;
    var success = 0;
    var command = processor.getConfigValue('command');
    filesToExecute.forEach(file => {
        var msg;
        var args = processor.getArgs(file);

        var result = spawn(command, args);

        if (result.status !== 0) {
            msg = `ERROR ${moment().format('YYYY-MM-DD HH:mm:ss')}: Repository uploading error for file: ${file}.\nstdout details\n${result.stdout}`;
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

    var result = spawn(command);

    return !result.error;
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