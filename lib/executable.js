
function Executable(print) {

}

function help(options) {
    var print = options.print;
    print('Usage: nilegacy [options] [files]');
    print('');

    print('Options:');
    print('%s\tturn off color in spec output', lPad('--no-color', 18));
    print('%s\tfilter specs to run only those that match the given string', lPad('--filter=', 18));
    print('%s\tload helper files that match the given string', lPad('--helper=', 18));
    print('%s\t[true|false] stop spec execution on expectation failure', lPad('--stop-on-failure=', 18));
    print('%s\tpath to your optional jasmine.json', lPad('--config=', 18));
    print('');
    print('The given arguments take precedence over options in your jasmine.json');
    print('The path to your optional jasmine.json can also be configured by setting the JASMINE_CONFIG_PATH environment variable');
}

function lPad(str, length) {
    if (str.length >= length) {
        return str;
    } else {
        return lPad(' ' + str, length);
    }
}