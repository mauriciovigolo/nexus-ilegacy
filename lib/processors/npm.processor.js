/**
 * @license
 * Copyright (c) 2017 Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/nexus-ilegacy/blob/master/LICENSE
 */
var path = require('path');

var config = {
    command: 'npm',
    description: 'Node Package Manager',
    args: {
        help: 'help'
    }    
};

function NpmProcessor(repoUrl) {
    config.repoUrl = repoUrl;

    if (!config.repoUrl) {
        throw new Error('Repository URL can\'t be null or undefined');
    }
}

NpmProcessor.prototype.getConfigValue = function (key) {
    return config[key];
}

NpmProcessor.prototype.prepareSpawn = function (file) {
    if (!file) {
        throw new Error('Filename can\'t be null or undefined');
    }

    var dir = path.dirname(file);

    var args = [
      'publish',
      dir,
      `--"@scope:registry=${config.repoUrl}`
    ];

    return args;
}

module.exports = NpmProcessor;