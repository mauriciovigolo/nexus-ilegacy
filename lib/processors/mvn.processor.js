var config = {
    command: 'mvn',
    description: 'Apache Maven',
    deployArgs: []
};

function MvnProcessor() {

}

MvnProcessor.prototype.getConfigValue = function (key) {
    return config[key];
}

function initArgs() {
    var args = [
        'deploy:deploy-file',
        '-DgeneratePOM=false',
        '-DrepositoryId=node-hosted-sanepar',
        '-Durl=http://central.sanepar.com.br:8081/repository/maven-hosted-thirdparty/',
        '-Dfile=' + file
    ];

    if (file.indexOf('-javadoc.jar') > -1) {
        var pomFile = file.substr(0, (file.length - 12)) + '.pom';

        args.push('-Dpackaging=javadoc');
        args.push('-DpomFile=' + pomFile);
    } else if (file.indexOf('-sources.jar') > -1) {
        var pomFile = file.substr(0, (file.length - 12)) + '.pom';

        args.push('-Dpackaging=java-source');
        args.push('-DpomFile=' + pomFile);
    } else if (file.indexOf('-client.jar') > -1) {
        var pomFile = file.substr(0, (file.length - 11)) + '.pom';

        args.push('-Dtype=client');
        args.push('-DpomFile=' + pomFile);
    } else {
        var pomFile = file.substr(0, (file.length - 4)) + '.pom';

        args.push('-DpomFile=' + pomFile);
    }

    config.args = args;
}

exports = module.exports = MvnProcessor;