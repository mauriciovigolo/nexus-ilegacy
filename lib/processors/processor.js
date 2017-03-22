var spawn = require('child_process').spawnSync;


function Processor(processor) {

    if (!isConfigured(processor.config.command)) {
        // TODO throw error!
    }


}


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