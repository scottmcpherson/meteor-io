var Command = require('{{commandPath}}');

class Template extends Command {
  constructor() {
    super();
    // A shorter name to call your generator with.
    this.alias = 't';
    // This name should match the file name without the extension.
    this.name = 'template';
    // A brief description on how to use this.
    this.description = 'io g:{template, t} [path/]<name>';
  }
  run(args, argv) {
    if (args.length < 2) {
      throw new Error('Requires two args');
    }

    var self = this;
    var fileBaseName = self.getBaseName(args[1]);
    var camelName = self.camelizeFileName(fileBaseName);

    this.writeTemplatesWithData({
      src: [self.ioTemplatesPath, 'template.html'],
      dest: [self.config.dest, fileBaseName + '.html'],
      data: { name: camelName }
    }, {
      src: [self.ioTemplatesPath, 'template.js'],
      dest: [self.config.dest, fileBaseName + '.js'],
      data: { name: camelName }
    });
  }
}

module.exports = new Template;
