
function Executable(print) {

}

Executable.prototype.help = function() {
    var print = console.log;
    // repositoryId, generatePom, pomFile, groupId, version, artifactId
    print('USAGE: nilegacy [repo] [options] directory');
    print('');
    print('Repo:');
    print('%s\tspecify the type of repo (maven|node|nuget)', lPad('repo', 18));
    print('');
    print('Options:');
    print('%s\trepository URL', lPad('--repoUrl=', 18));
    print('%s\t[ONLY MAVEN] repository ID as configured in Maven\'s settings.xml', lPad('--repositoryId=', 18));
    print('%s\t[ONLY MAVEN] true to force the pom generation, otherwise, will use the same name of the jar file, just changing the extension.', lPad('--generatePom=', 18));
    print('%s\t[ONLY MAVEN] repository URL. If none, will use the pom as ', lPad('--groupId=', 18));
    print('%s\tshow the current version', lPad('--version', 18));
    print('%s\tdisplay this help', lPad('--help', 18));
    print('');
    print('Example:');
    print('nilegacy maven --repoUrl=http://localhost:8081/repository/maven-hosted');
}

Executable.prototype.version = function() {
    console.log('1.0.0');
}

function lPad(str, length) {
    if (str.length >= length) {
        return str;
    } else {
        return lPad(' ' + str, length);
    }
}

module.exports = Executable;