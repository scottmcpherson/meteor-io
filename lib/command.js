var _ = require('underscore');
var Utils = require('./utils');
var path = require('path');
var fs = require('fs-extra');
var requireDir = require('require-dir');
var FileSystem = require('./utilities/file-system');
var meteorCommands = require('./utilities/meteor-commands');
var store = require('data-store')('io');

class Command extends Utils {
  constructor(opts) {
    super();
    opts = opts || {};
    this.name = opts.name;
    this.commands = opts.commands || [];
    this.generators = opts.generators || [];
    this.constantPaths = ['PROJECT_PATH', 'APP_PATH', 'PACKAGES_PATH'];
  }
  get commandKeys() {
    return _.keys(this.commands);
  }
  get generatorKeys() {
    return _.keys(this.generators);
  }
  run(args, argv) {
    // If this is the first time using
    // ion, we need to do some setup.
    var self = this;

    if (! this.isIoUserConfigPath()) {
      return this.commands.setup.run(args, argv);
    }

    this.loadUserCommands();
    this.loadUserGenerators();

    if (argv.help) {
      this.logHelp(this.commands, this.generators, this.ioPath);
      process.exit(1);
    }

    // If the command maps to a meteor command.
    if (this.isMeteorCommand(args) && this.findProjectDir()) {
      return this.commands.run.run(args, argv);
    }

    var whole = args[0];
    var command = this.findCommand(whole);
    var generator;

    if (command === 'generate') {
      generator = this.findGenerator(args[0]);
    }

    if (command === 'create' || this.isProjectDir()) {
      this.commands[command].bindCommandConfig(args);
      this.commands[command].run(args, argv);
    } else if (command === 'generate' &&
               generator &&
              (generator === 'generator' ||
               generator === 'cmd'))
    {
      this.commands[command].run(args, argv);
    } else if (!this.isProjectDir()) {
      this.logError('No io project found. Are you in an io project directory?');
    } else {
      this.logError('Command not found.');
    }
  }
  loadUserCommands() {
    var self = this;
    var usersCommandsPath = path.join(this.ioPath, 'commands');
    if (self.isDir(usersCommandsPath)) {
      var usersCommands = requireDir(usersCommandsPath);
      var adminCommands = requireDir('./commands');
      this.commands = _.extend(adminCommands, usersCommands);
    }
  }
  loadUserGenerators() {
    var self = this;
    var usersGenerators = path.join(this.ioPath, 'generators');
    if (self.isDir(usersGenerators)) {
      var usersGenerators = requireDir(usersGenerators);
      var adminGenerators = requireDir(self._adminGeneratorsDir);
      this.generators = _.extend(adminGenerators, usersGenerators);
    }
  }
  findCommand(command) {
    var self = this;
    var splitCommand = command.split(':');
    var result;

    if (this.commands.length === 0) {
      this.loadUserCommands();
    }

    var commands = this.commands;

    // TODO: Need to set up aliases
    if (splitCommand.length > 0) {
      _.each(commands, function(cmd) {
        let command = splitCommand[0];
        if ((_.has(cmd, 'name') && cmd.name === command) ||
            (_.has(cmd, 'alias') && cmd.alias === command))
        {
          result = cmd.name;
        }
      });
    }

    if (result) return result;

    this.logHelp(self.commands, self.generators);
    process.exit(1);
  }
  findGenerator(command) {
    var self = this;
    this.loadUserGenerators();
    var splitCommand = command.split(':');
    var generators = this.generators;
    var result;

    // XXX: Both files and generator's name have
    // to be unique. Need to find a way to return
    // the generator by it's property "name", and
    // not the file name.
    if (generators && splitCommand.length > 1) {
      _.each(generators, function(gen) {
        let splitGen = splitCommand[1];
        if ((_.has(gen, 'name') && gen.name === splitGen) ||
            (_.has(gen, 'alias') && gen.alias === splitGen))
        {
          result = gen.name;
        }
      });
    }

    if (result) return result;

    throw new Error('Can\'t find generator');
    process.exit(1);
  }
  runGenerator(generator, args, argv) {
    this.loadUserGenerators();

    // bindGeneratorConfig uses findDirectory, which will
    // throw an exception if not in an io dir. When generating
    // a new command or generator, we shouldn't need to be
    // in an io project. For now, when generating a command
    // or generator, don't bind the config to the generator.
    if (generator !== 'cmd' && generator !== 'generator') {
      this.generators[generator].bindGeneratorConfig(args);
    }
    this.generators[generator].run(args, argv);
  }
  runCommand(command, args, argv) {
    this.loadUserCommands();

    this.commands[command].run(args, argv);
  }
  isMeteorCommand(args) {
    return args.length === 0 || args.length > 0 &&
           _.contains(meteorCommands, args[0]);
  }
  bindCommandConfig(args) {
    var self = this;
    var commandName = self.name;
    var replaceDirs = this.constantPaths;
    var configFile;

    if (commandName === 'create') {
      configFile = this.globalConfig;
    } else {
      configFile = this.configFile;
    }

    if (configFile && configFile.commands && configFile.commands[commandName]) {
      self.config = configFile.commands[commandName] || {};
      if (_.has(self.config, 'dest')) {
        _.each(replaceDirs, function(dir) {
          let camelCase = self.convertConstantToVariable(dir);
          self.config.dest = self.config.dest.replace(dir, self[camelCase]);
        });

        // XXX: Need a better way to determine if the second arg is in fact a path
        if (args.length > 1) {
          let destPath = args[1];
          self.config.dest = self.config.dest.replace('DEST_PATH', destPath);
        }
      }
    }
  }
  bindGeneratorConfig(args) {
    var self = this;

    var generatorName = self.name;
    var configFile = this.configFile;
    var replaceDirs = this.constantPaths;

    if (configFile && configFile.generators && configFile.generators[generatorName]) {
      self.config = configFile.generators[generatorName] || {};
      if (_.has(self.config, 'dest')) {
        _.each(replaceDirs, function(dir) {
          let camelCase = self.convertConstantToVariable(dir);
          self.config.dest = self.config.dest.replace(dir, self[camelCase]);
        });

        // XXX: Need a better way to determine if the second arg is in fact a path
        if (args.length > 1) {
          let destPath = args[1];
          self.config.dest = self.config.dest.replace('DEST_PATH', destPath);
        }
      }
    }
  }
};

module.exports = Command;
