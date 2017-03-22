var spawn = require('child_process').spawnSync;
var mvnProcessor = require('./mvn.processor');


function Processor() { }


/**
 *
 *
 * @param {string} command
 */
function isConfigured(command) {
    var result = spawn(command);

    return !result.error;
}


module.exports = Processor;