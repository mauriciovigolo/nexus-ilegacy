var fm = require('file-matcher');
var spawn = require('child_process').spawnSync;

var matcher = new fm.FileMatcher();


var criteria = {
    path: '/home/mauriciovigolo/artifactory-thirdparty/repositories/thirdpart-repo/',
    recursiveSearch: true,
    fileFilter: {
        fileNamePattern: '**/*.jar'
    }
};


console.log(argv);


/*
matcher.find(criteria)
    .then(function (files) {
        if (!files || files.length === 0) {
            console.log('No files found!');
            return;
        }

        for (var index = 0; index < files.length; index++) {
            var file = files[index];

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

            var result = spawn('mvn', args);

            if (result.status !== 0) {
                console.log('File: ' + file, 'Output: ' + result.stdout);
            }
        }
    })
    .catch(function (error) {
        console.log(error);
    });
*/