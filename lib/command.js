var _ = require('underscore');
var Utils = require('./utils');
var path = require('path');
var fs = require('fs-extra');
var requireDir = require('require-dir');
var FileSystem = require('./utilities/file-system');

class Command extends Utils {
  constructor(opts) {
    super();
    opts = opts || {};
    this.name = opts.name;
    this.commands = opts.commands || [];
    this.generators = opts.generators || [];
  }
  get commandKeys () {
    return _.keys(this.commands);
  }
  get generatorKeys () {
    return _.keys(this.generators);
  }
  run(args, argv) {
    // If this is the first time using
    // ion we need to do some setup
    if (! this.isIonUserConfigPath()){
      return this.commands.setup.run(args, argv);
    }

    // If just ion, then run the app (meteor)
    if (args.length === 0 && this.findProjectDir()) {
      return this.commands.run.run(args, argv);
    }

    this.loadUserCommands();

    var whole = args[0];
    var command = this.findCommand(whole);

    if (command === 'create') {
      this.commands[command].run(args, argv);
    } else if (this.findProjectDir()) {
      this.commands[command].run(args, argv);
    } else {
      this.logError('Command not found.');
    }
  }
  findCommand (command) {

    var splitCommand = command.split(':');
    // TODO: Need to set up aliases
    if (splitCommand.length > 0) {
      let command = splitCommand[0];

      if (splitCommand[0] === 'g')
        command = 'generate';
      if (_.contains(this.commandKeys, command))
        return command;
    }

    throw new Error("Can't find command");

    // console.log("split: ", splitCommand);
    if (splitCommand.length > 0 &&
        _.contains(this.commandKeys, splitCommand[0]))
    {
      return splitCommand[0];
    } else {
      throw new Error("Can't find command");
    }
  }
  loadUserCommands () {
    var self = this;
    var usersCommandsPath = path.join(this.ionPath, 'commands');
    var usersCommands = requireDir(usersCommandsPath);
    this.commands = _.extend(self.commands, usersCommands);
  }
  findGenerator (command) {
    var usersGenerators = path.join(this.ionPath, 'generators');
    this.generators = requireDir(usersGenerators);
    var splitCommand = command.split(':');

    if (splitCommand.length > 1 &&
        _.contains(this.generatorKeys, splitCommand[1]))
    {
      return splitCommand[1];
    }
    throw new Error("Can't find generator");
  }
  runGenerator (generator) {
  }

};

module.exports = Command;

