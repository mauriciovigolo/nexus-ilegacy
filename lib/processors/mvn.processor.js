/**
 * @license
 * Copyright (c) 2017 Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/nexus-ilegacy/blob/master/LICENSE
 */
var config = {
    command: 'mvn',
    description: 'Apache Maven',
};


/**
 *
 *
 * @param {string} repoUrl
 * @param {string} repositoryId
 * @param {boolean} generatePom
 * @param {string} groupId
 */
function MvnProcessor(repoUrl, repositoryId, generatePom, groupId) {
    config.repoUrl = repoUrl;
    config.repositoryId = repositoryId;
    config.generatePom = generatePom;
    config.groupId = groupId;

    if (!config.repoUrl) {
        throw new Error('Repository URL can\'t be null or undefined');
    }

    if (!config.repositoryId) {
        throw new Error('repositoryId can\'t be null or undefined');
    }
}


MvnProcessor.prototype.getConfigValue = function (key) {
    return config[key];
}


MvnProcessor.prototype.getArgs = function (file) {
    var args = [
        `deploy:deploy-file`,
        `-Dfile=${file}`,
        `-Durl=${config.repoUrl}`,
        `-DrepositoryId=${config.repositoryId}`
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

    if (!config.generatePom) {
        args.push(
            `-DgeneratePOM=false`,
            `-DpomFile=${pomFile}`
        );
    } else if (config.groupId) {
        args.push(
            `-DgroupId=${config.groupId}`
        );
    }

    return args;
}


module.exports = MvnProcessor;