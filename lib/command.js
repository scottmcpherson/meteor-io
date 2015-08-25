var _ = require('underscore');
var Utils = require('./utils');
var path = require('path');
var fs = require('fs-extra');
var requireDir = require('require-dir');
var FileSystem = require('./utilities/file-system');
var meteorCommands = require('./utilities/meteor-commands');

class Command extends Utils {
  constructor (opts) {
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
  run (args, argv) {
    // If this is the first time using
    // ion we need to do some setup
    if (! this.isIonUserConfigPath()){
      return this.commands.setup.run(args, argv);
    }

    // If the command maps to a meteor command
    if (this.isMeteorCommand(args) && this.findProjectDir()) {
      return this.commands.run.run(args, argv);
    }

    this.loadUserCommands();
    this.loadUserGenerators();

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
    var self = this;
    var splitCommand = command.split(':');
    // TODO: Need to set up aliases
    if (splitCommand.length > 0) {
      let command = splitCommand[0];

      if (splitCommand[0] === 'g')
        command = 'generate';

      if (_.contains(this.commandKeys, command))
        return command;
    }

    if (splitCommand.length > 0 &&
        _.contains(this.commandKeys, splitCommand[0]))
    {
      return splitCommand[0];
    } else {
      this.logHelp(self.commands, self.generators);
      process.exit(1);
    }
  }
  loadUserCommands () {
    var self = this;
    var usersCommandsPath = path.join(this.ionPath, 'commands');
    if (self.isDir(usersCommandsPath)) {
      var usersCommands = requireDir(usersCommandsPath);
      this.commands = _.extend(self.commands, usersCommands);
    }
  }
  loadUserGenerators () {
    var self = this;
    var usersGenerators = path.join(this.ionPath, 'generators');
    if (self.isDir(usersGenerators)) {
      this.generators = requireDir(usersGenerators);
    }
  }
  findGenerator (command) {
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
  isMeteorCommand (args) {
    return args.length === 0 || args.length > 0 &&
           _.contains(meteorCommands, args[0]);
  }

};

module.exports = Command;

