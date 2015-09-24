var Command = require('{{commandPath}}');

class Template extends Command {
  constructor() {
    super();
    this.alias = 't';
    this.name = 'template';
    this.description = 'io g:{template, t} [path/]<name>';
  }
  run(args, argv) {
    if (args.length < 2)
      throw new Error('Requires two args');

    var self = this;
    var fileBaseName = self.getBaseName(args[1]);
    var camelName = self.camelizeFileName(fileBaseName);

    this.writeTemplatesWithData({
      src: [self.ioTemplatesPath, 'template.html'],
      dest: [self.config.dest, fileBaseName + '.html'],
      data: { name: camelName }
    }, {
      src: [self.ioTemplatesPath, 'template.js'],
      dest: [self.config.dest, fileBaseName + '.jsx'],
      data: { name: camelName }
    });
  }
}

module.exports = new Template;
