const _ = require('underscore');
const Utils = require('./utils');
const path = require('path');
const fs = require('fs-extra');
const requireDir = require('require-dir');
const FileSystem = require('./utilities/file-system');
const meteorCommands = require('./utilities/meteor-commands');
const store = require('data-store')('io');

class Command extends Utils {
  constructor(opts = {}) {
    super();
    this.name = opts.name;
    this.commands = opts.commands || [];
    this.generators = opts.generators || [];
    this.constantPaths = ['$PROJECT_PATH', '$APP_PATH', '$PACKAGES_PATH',
        'PROJECT_PATH', 'APP_PATH', 'PACKAGES_PATH'];
  }
  get commandKeys() {
    return _.keys(this.commands);
  }
  get generatorKeys() {
    return _.keys(this.generators);
  }
  run(args, argv) {

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

    const whole = args[0];
    const command = this.findCommand(whole);
    let generator;

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
    const usersCommandsPath = path.join(this.ioPath, 'commands');
    if (this.isDir(usersCommandsPath)) {
      const usersCommands = requireDir(usersCommandsPath);
      const adminCommands = requireDir('./commands');
      this.commands = _.extend(adminCommands, usersCommands);
    }
  }
  loadUserGenerators() {
    const usersGeneratorsPath = path.join(this.ioPath, 'generators');
    if (this.isDir(usersGeneratorsPath)) {
      const usersGenerators = requireDir(usersGeneratorsPath);
      const adminGenerators = requireDir(this._adminGeneratorsDir);
      this.generators = _.extend(adminGenerators, usersGenerators);
    }
  }
  findCommand(command) {
    const splitCommand = command.split(':');
    let result;

    if (this.commands.length === 0) {
      this.loadUserCommands();
    }

    var commands = this.commands;

    // TODO: Need to set up aliases
    if (splitCommand.length > 0) {
      _.each(commands, (cmd) => {
        let command = splitCommand[0];
        if ((_.has(cmd, 'name') && cmd.name === command) ||
            (_.has(cmd, 'alias') && cmd.alias === command))
        {
          result = cmd.name;
        }
      });
    }

    if (result) return result;

    this.logHelp(this.commands, this.generators);
    process.exit(1);
  }
  findGenerator(command) {
    this.loadUserGenerators();
    const splitCommand = command.split(':');
    const generators = this.generators;
    let result;

    // XXX: Both files and generator's name have
    // to be unique. Need to find a way to return
    // the generator by it's property "name", and
    // not the file name.
    if (generators && splitCommand.length > 1) {
      _.each(generators, (gen) => {
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
    const commandName = this.name;
    const replaceDirs = this.constantPaths;
    let configFile;

    if (commandName === 'create') {
      configFile = this.globalConfig;
    } else {
      configFile = this.configFile;
    }

    if (configFile && configFile.commands && configFile.commands[commandName]) {
      this.config = configFile.commands[commandName] || {};
      if (_.has(this.config, 'dest')) {
        _.each(replaceDirs, (dir) => {
          const str = dir.replace('$', '');
          const camelCase = this.convertConstantToVariable(str);
          this.config.dest = this.config.dest.replace(dir, this[camelCase]);
        });

        // XXX: Need a better way to determine if the second arg is in fact a path
        if (args.length > 1) {
          const destPath = args[1];
          this.config.dest = this.config.dest.replace('$DEST_PATH', destPath);
        }
      }
    }
  }
  bindGeneratorConfig(args) {
    const generatorName = this.name;
    const configFile = this.configFile;
    const replaceDirs = this.constantPaths;

    if (configFile && configFile.generators && configFile.generators[generatorName]) {
      this.config = configFile.generators[generatorName] || {};
      if (_.has(this.config, 'dest')) {
        _.each(replaceDirs, (dir) => {
          const str = dir.replace('$', '');
          const camelCase = this.convertConstantToVariable(str);
          this.config.dest = this.config.dest.replace(dir, this[camelCase]);
        });

        // XXX: Need a better way to determine if the second arg is in fact a path
        if (args.length > 1) {
          const destPath = args[1];
          this.config.dest = this.config.dest.replace('$DEST_PATH', destPath);
        }
      }
    }
  }
};

module.exports = Command;
