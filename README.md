# io (for Meteor)
io is an experimental, pluggable command line scaffolding tool written entirely in es6.
## Table of Contents
* [Getting Started](#getting-started)

## Getting Started
Install the npm package:
```shell
npm install -g meteor-io
```
And then run io from anywhere:
```shell
io
```
io will ask you to specify a directory to set up a couple sample commands, generators, templates, and a config file.

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
This will set up a boiler plate io project for you. If you're not happy with the structure of the project that io creates, you can always override the create command by generating one of your own:
```sh
io g:cmd create
```
