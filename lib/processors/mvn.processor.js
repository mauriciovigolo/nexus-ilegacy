var config = {
    command: 'mvn',
    description: 'Apache Maven',
};


/**
 *
 *
 * @param {string} file
 * @param {string} repoUrl
 * @param {string} repositoryId
 * @param {boolean} generatePom
 * @param {string} groupId
 */
function MvnProcessor(file, repoUrl, repositoryId, generatePom, groupId) {
    config.file = file;
    config.repoUrl = repoUrl;
    config.repositoryId = repositoryId;
    config.generatePom = generatePom;
    config.groupId = groupId;
}


/**
 *
 *
 * @param {string} key
 */
MvnProcessor.prototype.getConfigValue = function (key) {
    return config[key];
}


MvnProcessor.prototype.getArgs = function () {
    if (!config.file) {
        throw new Error('Filename can\'t be null or undefined');
    }

    if (!config.repoUrl) {
        throw new Error('Repository URL can\'t be null or undefined');
    }

    var args = [
        `deploy:deploy-file`,
        `-Dfile=${config.file}`,
        `-Durl=${config.repoUrl}`
    ];

    var pomFile;
    // Package definition
    if (config.file.indexOf('-javadoc.jar') > -1) {
        pomFile = config.file.substr(0, (config.file.length - 12)) + '.pom';
        args.push('-Dpackaging=javadoc');
    } else if (config.file.indexOf('-sources.jar') > -1) {
        pomFile = config.file.substr(0, (config.file.length - 12)) + '.pom';
        args.push('-Dpackaging=java-source');
    } else {
        pomFile = config.file.substr(0, (config.file.length - 4)) + '.pom';
    }

    if (!config.generatePom) {
        args.push(
            `-DgeneratePOM=false`,
            `-DpomFile=${config.pomFile}`
        );
    } else if (config.groupId) {
        args.push(
            `-DgroupId=${config.groupId}`
        );
    }

    if (config.repositoryId) {
        args.push(
            `-DrepositoryId=${config.repositoryId}`
        );
    }

    return args;
}


exports = module.exports = MvnProcessor;