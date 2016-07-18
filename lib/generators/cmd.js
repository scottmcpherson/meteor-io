const Command = require('../command');

class Cmd extends Command {
  constructor() {
    super();
    this.alias = 'cmd';
    this.name = 'cmd';
    this.description = 'io g:cmd <name>';
  }
  run(args, argv) {
    var self = this;
    var commandName = args[1];
    var commandFileName = commandName + '.js';
    var className = this.classify(commandName);
    var userIoCommandPath = this.join(self.ioPath, 'commands', commandFileName);

    this.writeTemplateWithData({
      src: [self._adminConfigPath, 'command.js'],
      dest: userIoCommandPath,
      data: {
        commandPath: self._adminCommandPath,
        name: commandName,
        className: className,
        alias: self.makeAliasFromFileName(commandName)
      }
    });

    console.log();
    self.logSuccess('Command created: ', userIoCommandPath);
    console.log();

    return process.exit(1);
  }
}

module.exports = new Cmd;
