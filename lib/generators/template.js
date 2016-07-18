const Command = require('../command');

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

    const fileBaseName = this.getBaseName(args[1]);
    const camelName = this.camelize(fileBaseName);

    console.log();
    this.writeTemplatesWithData({
      src: [this.ioTemplatesPath, 'template.html'],
      dest: [this.config.dest, fileBaseName + '.html'],
      data: { name: camelName }
    }, {
      src: [this.ioTemplatesPath, 'template.js'],
      dest: [this.config.dest, fileBaseName + '.js'],
      data: { name: camelName }
    });
    console.log();
  }
}

module.exports = new Template;
