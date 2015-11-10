# io (for Meteor)
io is a pluggable and extendable, command-line scaffolding tool written entirely in es6.

It gives you the ability to create custom commands, generators, and templates to facilitate your Meteor workflow.

Windows has not yet been thoroughly tested.
## Table of Contents
* [Getting Started](#getting-started)
* [Config Files](#config-files)
* [Generators](#generators)
* [Commands](#commands)
* [Templating](#templating)
* [API](#api)

## Getting Started
io leverage es6 and required node v4.2.1 or later.

To install the meteor-io npm package:
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

## Templating
io uses handlebars to generate templates. Templates can be used to dynamically create files and resources for you app. Take for example the template that's used to generate helpers, events, and life-cycle callbacks when you run `io g:template template-name`.
The template that's used to generate those resources can be found at `path/to/your/io/templates/template.js`, and looks like this:
```js
Template.{{name}}.events({
});

Template.{{name}}.helpers({
});

Template.{{name}}.onCreated(function () {
});

Template.{{name}}.onRendered(function () {
});

Template.{{name}}.onDestroyed(function () {
});
```
And we can use this template and interpolate the data by calling [writeTemplateWithData](https://github.com/scottmcpherson/meteor-io#thiswritetemplatewithdata-src-path-dest-path-data-data-) or [writeTemplatesWithData](https://github.com/scottmcpherson/meteor-io#thiswritetemplateswithdataargs-args).
For example, given the command `io g:template template-name`:
```
  run(args, argv) {

    var fileBaseName = self.getBaseName(args[1]);
    // template-name

    var camelCaseName = self.camelizeFileName(fileBaseName);
    // templateName

    this.writeTemplateWithData({
      src: [this.ioTemplatesPath, 'template.js'],
      dest: [this.config.dest, fileBaseName + '.js'],
      data: { name: camelCaseName }
    });

```


## API
io provides you with a high-level API for creating custom commands and generators. All of which can be accessed and called from within the `run()` methods of your generators and commands.

#### *this*.ioTemplatesPath;
Gets the path to your io templates.

#### *this*.projectPath;
Gets the path to your io project.

#### *this*.appPath;
Gets the path to your meteor app inside the io project.

#### *this*.settingsPath;
Gets the path to your app's local setting.json file.

#### *this*.envPath;
Gets the path to your app's local env.sh file.

#### *this*.globalConfig;
Gets the global config in a JSON format.

#### *this*.localConfig;
Gets the project's local config in a JSON format.

#### *this*.configFile;
Gets the global config in a JSON format.

#### *this*.configFile;
Gets both the local and global config, merges them, and returns the JSON.

#### *this*.mkdir([path]);
Creates a directory with a given path String, or an Array of path parts.

Examples:
```js
run(args, argv) {
  this.mkdir([this.appPath, 'client', templates]);
  // Creates a directory at: path/to/project/app/client/templates
```
```js
run(args, argv) {
  this.mkdir('path/to/project/app/client/templates');
  // creates a directory at: path/to/project/app/client/templates
```

#### *this*.mkdirs([path], [path]);
Creates x number of directories with given path Strings, or Arrays of path parts.

Example:
```js
run(args, argv) {
  var templatesPath = this.join(this.appPath, 'client', templates);
  this.mkdirs([templatesPath, 'public'],
              [templatesPath, 'admin']);
  // Creates directories at:
  // path/to/project/app/client/templates/public
  // path/to/project/app/client/templates/admin
```

#### *this*.copy([srcPath], [destPath]);
Copies a file from the given source path to the destination path.

Both paths can be either a String, or an array of path parts.

Examples:
```js
run(args, argv) {
  var src = this.join(this.ioTemplatesPath, 'sample.js');
  var dest = this.join(this.appPath, 'client', 'templates', 'sample.js');
  this.copy(src, dest);
  // Copies the file from: path/to/your/io/templates/sample.js
  // to: path/to/your/project/app/client/templates/sample.js
```

#### *this*.copyAll({ src: src, dest: dest }, { src: src, dest: dest });
Copies x number of files from given source paths to destination paths.

Example:
```js
run(args, argv) {
  var appTemplatesPath = this.join(this.appPath, 'client', 'templates');
  this.copy({
    src: [this.ioTemplatesPath, 'sample-one.js'],
    dest: [appTemplatesPath, 'sample-one.js']
  }, {
    src: [this.ioTemplatesPath, 'sample-two.js'],
    dest: [appTemplatesPath, 'sample-two.js']
  });
  // from: path/to/your/io/templates/sample-one.js
  // to: path/to/your/project/app/client/templates/sample-one.js
  // from: path/to/your/io/templates/sample-two.js
  // to: path/to/your/project/app/client/templates/sample-two.js
```

#### *this*.remove([srcPath]);
This will remove the file at the given source path.

#### *this*.removeAll([srcPath], [srcPath]);
This will remove x number of files at the given source paths.

#### *this*.writeTemplateWithData({ src: [path], dest: [path], data: data });
Grabs a template, interpolates the data, and writes the template to the specified dest path.

Example:
```js
run(args, argv) {
  var appTemplatesPath = this.join(this.appPath, 'client', 'templates');
  this.copy({
    src: [this.ioTemplatesPath, 'sample.js'],
    dest: [appTemplatesPath, 'sample.js'],
    data: { name: 'demo' }
  });
  // This will get the template from `path/to/your/io/templates/sample.js`,
  // interpolate the data, and write the file to `path/to/your/project/app/client/templates/sample.js`
```

#### *this*.writeTemplatesWithData({args}, {args});
Same as writeTemplateWithData, but allows you to write multiple templates with data.

Example:
```js
run(args, argv) {
  var appTemplatesPath = this.join(this.appPath, 'client', 'templates');
  this.copy({
    src: [this.ioTemplatesPath, 'sample.js'],
    dest: [appTemplatesPath, 'sample.js'],
    data: { name: 'demo' }
  }, {
    src: [this.ioTemplatesPath, 'sample-two.js'],
    dest: [appTemplatesPath, 'sample-two.js'],
    data: { name: 'demo' }
  });
  // This will get the template from `path/to/your/io/templates/sample.js`,
  // interpolate the data, and write the file to `path/to/your/project/app/client/templates/sample.js`
  // And the template from `path/to/your/io/templates/sample-two.js`,
  // interpolate the data, and write the file to `path/to/your/project/app/client/templates/sample-two.js`
```

#### *this*.writeFile(filePath);
Write a blank file to the specified filePath. filePath must be a **String**.

Example:
```js
run(args, argv) {
  this.writeFile('path/to/your/project/app/client/templates/sample.js');
  // Creates a blank file at path/to/your/project/app/client/templates/sample.js
```