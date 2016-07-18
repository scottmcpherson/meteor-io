const Command = require('../command');

class Page extends Command {
  constructor() {
    super();
    // A shorter name to call your generator with.
    this.alias = 'pg';
    // This name should match the file name without the extension.
    this.name = 'page';
    // A brief description on how to use this.
    this.description = 'io g:{page, pg} [path/]<name>';
  }
  run(args, argv) {
    if (args.length < 2) {
      throw new Error('Requires two args');
    }

    const fileBaseName = this.getBaseName(args[1]);
    const className = this.classify(fileBaseName);

    this.writeTemplatesWithData({
      src: 'page.jsx',
      dest: [this.config.dest, className + 'Page.jsx'],
      data: { shortName: className, longName: className + 'Page' }
    });
  }
}

module.exports = new Page;
