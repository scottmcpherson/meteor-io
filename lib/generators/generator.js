var Command = require('../command');

class Generator extends Command {
  constructor() {
    super();
    this.alias = 'gen';
    this.name = 'generator';
    this.description = 'io g:{generator, gen} <name>';
  }
  run(args, argv) {
    var self = this;
    var generatorName = args[1];
    var generatorFileName = generatorName + '.js';
    var className = this.converFileToClassName(generatorName);
    var userIoGeneratorPath = this.join(self.ioPath, 'generators', generatorFileName);

    this.writeTemplateWithData({
      src: [self._adminConfigPath, 'generator.js'],
      dest: userIoGeneratorPath,
      data: {
        commandPath: self._adminCommandPath,
        name: generatorName,
        className: className,
        alias: self.makeAliasFromFileName(generatorName)
      }
    });

    console.log();
    self.logSuccess('Generator created: ', userIoGeneratorPath);
    console.log();

    return process.exit(1);
  }
}

module.exports = new Generator;
