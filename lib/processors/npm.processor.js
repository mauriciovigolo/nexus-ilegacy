var config = {
    command: 'npm',
    description: 'Node Package Manager'
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



NpmProcessor.prototype.getArgs = function (file) {
    if (!file) {
        throw new Error('Filename can\'t be null or undefined');
    }

    var args = [
    ];

    return args;
}


module.exports = NpmProcessor;