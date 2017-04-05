## nexus-ilegacy
Tool to import legacy libraries to Nexus OSS

---

* [About](#about)
* [Prerequisites](#prerequisites)
* [Installing](#installing)
* [Usage](#usage)
* [History](#history)
* [License](#license)

---


## About
The purpose of this CLI is to import Maven, NPM or NuGet artifacts to the Nexus OSS. It all began when we started to migrate from the Artifactory repo to the Nexus OSS repo at work. At that moment I didn't find a tool or functionality at Nexus to get the job done. So to avoid repetitive work I decided to write a simple cli that calls mvn, npm and nuget behind, taking a directory as starting point, to recursively search for artifacts to deploy to the Nexus OSS 3x.

During the execution is possible to check the total of import success and errors and in the end of the processing the CLI will generate a log file, so it will be better to evaluate the results.

This beta release works with maven, however soon the npm and nuget will also be available.



## Prerequisites
The nexus-ilegacy CLI require:
* Node 6.9.0 or higher
* NPM 3 or higher
* Maven 3.3 or higher - to import Maven artifacts
* NuGet 3 or higher - to import .NET artifacts



## Installing

To install the CLI command:
```bash
npm install i -g nexus-ilegacy
```

Docs install the Maven and NuGet
* [Maven](https://maven.apache.org/install.html)
* [NuGet](https://www.microsoft.com/net/core#linuxredhat)

**IMPORTANT**:
1. Both Maven and NuGet need to be on OS PATH variable.
2. For Maven be sure to configure a server in the settings.xml file at the .m2 folder. This is needed as it contains the credentials to deploy the artifact to the Nexus maven repository.

Example of a settings.xml file:
```bash
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                      https://maven.apache.org/xsd/settings-1.0.0.xsd">
  <servers>
    <server>
      <id>{server_name}</id>
      <username>{nexus_user_login}</username>
      <password>{passwd}</password>
    </server>
  </servers>
</settings>
```

This server id the "--repositoryId" argument, so the mvn command will get this username and password to proceed with the deploy.

**HINT**
Never expose your password in plain text. For maven password encryption , follow [this guide](https://maven.apache.org/guides/mini/guide-encryption.html).



## Usage

```bash
nilegacy --help
```

The command syntax is:
```bash
nilegacy [repo] [options] directory_to_search_recursively
```

1. Repo
In the repo argument you should use one of following options:
* maven
* npm
* nuget


2. Options
**General options** (valid for maven, nuget and npm):
    * --repoUrl - repository URL
    * --version - show the current version
    * --help - display help
    * --output -change the output log file. Default is ./nilegacy-YYYYMMDDHHmmss.log

**Options available only for maven**:
    * --repositoryId -repository ID as configured in Maven's settings.xml
    * --generatePom - if specified will force the pom generation, otherwise, will use the same name of the jar file for the pom
    * --groupId - group ID must be informed if generatePom is true

3. Directory
The directory path to search for files. The followings extensions will search for:
* maven: ".jar"
* nuget: ".nupkg"
* npm: "package.json"
The CLI will recursively look for files.

**IMPORTANT** The user MUST has access to the directory otherwise it will not work.


### Importing Maven Artifacts
TODO: To be done


### Importing NuGet Artifacts
TODO: To be done


### Importing NPM Artifacts
TODO: To be done



## History
For the list of all changes see the [history log](CHANGELOG.md).



## License

Licensed under [MIT](LICENSE.md).

Copyright (c) 2017 Mauricio Gemelli Vigolo [@mauriciovigolo](https://twitter.com/mauriciovigolo)