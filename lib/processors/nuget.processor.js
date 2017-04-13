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


function NugetProcessor(repoUrl, apiKey) {
  config.repoUrl = repoUrl;
  config.apiKey = apiKey;

  if (!config.repoUrl || !config.apiKey) {
    throw new Error('Repository URL and api key can\'t be null or undefined');
  }
}


NugetProcessor.prototype.getConfigValue = function (key) {
  return config[key];
}


NugetProcessor.prototype.prepareSpawn = function (file) {
  if (!file) {
    throw new Error('Filename can\'t be null or undefined');
  }

  var args = [
    'push',
    file,
    config.apiKey,
    '-Source',
    config.repoUrl
  ];

  return args;
}


module.exports = NugetProcessor;