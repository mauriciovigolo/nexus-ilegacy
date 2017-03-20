var fm = require('file-matcher');
var spawn = require('child_process').spawnSync;

var matcher = new fm.FileMatcher();

var criteria = {
    path: '',
    recursiveSearch: true,
    fileFilter: {
        fileNamePattern: '**/*.jar'
    }
};


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
                '-DrepositoryId=',
                '-Durl=',
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

                args.push('-Dpackaging=client');
                args.push('-DpomFile=' + pomFile);
            } else {
                var pomFile = file.substr(0, (file.length - 4)) + '.pom';

                args.push('-DpomFile=' + pomFile);
            }

            var result = spawn('mvn', args);

            if (result.status !== 0) {
                console.log('File: ' + file, 'Output: ' + result.stdout);
            }

            mvn.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            mvn.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });

            mvn.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });
        }
    })
    .catch(function (error) {
        console.log(error);
    });