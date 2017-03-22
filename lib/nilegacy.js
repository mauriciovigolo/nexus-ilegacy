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