var spawn = require('child_process').spawnSync;

function MvnProcessor() { }

MvnProcessor.prototype.config = {
    command: 'mvn',
    description: 'Apache Maven',
    deployArgs: [

    ]
};

exports = module.exports = MvnProcessor;