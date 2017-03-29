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