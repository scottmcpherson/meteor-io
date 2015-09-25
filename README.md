# io (for Meteor)
io is an experimental, pluggable command line scaffolding tool written entirely in es6.
## Table of Contents
* [Getting Started](#getting-started)
* [Config Files](#config-files)
* [Generators](#generators)
* [Commands](#commands)
* [API](#api)

## Getting Started
io leverage some es6 features. To use io, you will first need to install [iojs](https://iojs.org/en/).

After iojs is installed, install the meteor-io npm package:
```shell
npm install -g meteor-io
```
And then run io from anywhere:
```shell
io
```
io will ask you to specify a directory to set up a couple sample generators, templates, and a config file.

After you specify a directory, io will create a director that looks similar to this:
```
io/
  .io/
    config.json
  generators/
    route.js
    template.js
  templates/
    package.js
    route.js
    template.html
    template.js
```
To create a new io project:
```shell
io create project-name
```
This will set up a boiler plate io project for you.

If you're not happy with the structure of the project that io creates, you can always override the create command by generating one of your own:
```sh
io g:cmd create
```
This will create a command for at: `path/to/your/io/commands/create.js`

(If you forget where io is installed, run `io --help`)

Once your project is created, you can then cd into your project and run the io command to start the server:
```sh
io
```

## Config Files
The first time you run the io command, it will create a global config for you: `path/to/your/io/.io/config.json`
You can modify this file to control which packages will be installed and removed when you run `io create project-name`.
By default, it will install: `kadira:flow-router` and `kadira:blaze-layout`, and remove: `autopublish` and `insecure`.

io will also create a local config file for you in your project when you run `io create project-name`. Local config settings will trump globals.

## Generators
io automatically creates a couple of sample generators for you. One to generate routes—io uses [FlowRouter](https://github.com/kadirahq/flow-router) by default, but you can set it up to use any router, and one to generate templates.
You'll be able to see and modify these generators in your local io/generators folder, and run them with the following commands:
```sh
io g:route route-name
io g:template template-name
```

To create a new pluggable generator:
```sh
io g:generator generator-name
```

## Commands
Command and generators both extend the Command class, and both have access to the same functionality. They're just two separate means to organize actions.
And command are called without the `g:` prefix.

To run a command:
```sh
io command-name args
```

To generate a new pluggable command:
```sh
io g:cmd command-name
```

## API
io provides you with a high-level API for creating custom commands and generators. All of which can be accessed from within the `run()` methods of your generators or commands.

#### this.ioTemplatesPath;
Gets the path to your io templates.

#### this.projectPath;
Gets the path to your io project.

#### this.appPath;
Gets the path to your meteor app inside the io project.

#### this.settingsPath;
Gets the path to your app's local setting.json file.

#### this.envPath;
Gets the path to your app's local env.sh file.

#### this.globalConfig;
Gets the global config in a JSON format.

#### this.localConfig;
Gets the project's local config in a JSON format.

#### this.configFile;
Gets the global config in a JSON format.

#### this.configFile;
Gets both the local and global config, merges them, and returns the JSON.
