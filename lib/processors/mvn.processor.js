var config = {
    command: 'mvn',
    description: 'Apache Maven'
};


function MvnProcessor() {

}

/**
 *
 *
 * @param {string} key
 */
MvnProcessor.prototype.getConfigValue = function (key) {
    return config[key];
}

/**
 *
 *
 * @param {string} file
 * @param {string} repoUrl
 * @param {string} repositoryId
 * @param {boolean} generatePom
 * @param {string} groupId
 */
MvnProcessor.prototype.getArgs = function (file, repoUrl, repositoryId, generatePom, groupId) {
    if (!file) {
        throw new Error('Filename can\'t be null or undefined');
    }

    if (!repoUrl) {
        throw new Error('Repository URL can\'t be null or undefined');
    }

    var args = [
        `deploy:deploy-file`,
        `-Dfile=${file}`,
        `-Durl=${repoUrl}`
    ];

    var pomFile;
    // Package definition
    if (file.indexOf('-javadoc.jar') > -1) {
        pomFile = file.substr(0, (file.length - 12)) + '.pom';
        args.push('-Dpackaging=javadoc');
    } else if (file.indexOf('-sources.jar') > -1) {
        pomFile = file.substr(0, (file.length - 12)) + '.pom';
        args.push('-Dpackaging=java-source');
    } else {
        pomFile = file.substr(0, (file.length - 4)) + '.pom';
    }

    if (!generatePom) {
        args.push(
            `-DgeneratePOM=false`,
            `-DpomFile=${pomFile}`
        );
    } else if (groupId) {
        args.push(
            `-DgroupId=${groupId}`
        );
    }

    if (repositoryId) {
        args.push(
            `-DrepositoryId=${repositoryId}`
        );
    }

    return args;
}


exports = module.exports = MvnProcessor;