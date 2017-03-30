/**
 * @license
 * Copyright (c) 2017 Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/nexus-ilegacy/blob/master/LICENSE
 */
var config = {
    command: 'nuget',
    description: 'Microsoft Package Manager'
};


function NugetProcessor(repoUrl) {
    config.repoUrl = repoUrl;

    if (!config.repoUrl) {
        throw new Error('Repository URL can\'t be null or undefined');
    }
}


NugetProcessor.prototype.getConfigValue = function (key) {
    return config[key];
}


NugetProcessor.prototype.getArgs = function (file) {
    if (!file) {
        throw new Error('Filename can\'t be null or undefined');
    }

    var args = [
    ];

    return args;
}


module.exports = NugetProcessor;