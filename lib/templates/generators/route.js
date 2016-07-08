var Command = require('{{commandPath}}');

class Route extends Command {
  constructor() {
    super();
    // A shorter name to call your generator with.
    this.alias = 'r';
    // This name should match the file name without the extension.
    this.name = 'route';
    // A brief description on how to use this.
    this.description = 'io g:{route, r} [path/]<name>';
  }
  run(args, argv) {
    if (args.length < 2) {
      throw new Error('Requires two args');
    }

    var self = this;
    var fileBaseName = self.getBaseName(args[1]);
    var camelName = self.camelizeFileName(fileBaseName);

    console.log();

    // Create the route
    this.writeTemplateWithDataToEndOfFile({
      src: [self.ioTemplatesPath, 'route.js'],
      dest: self.config.dest,
      data: { name: fileBaseName, camelName }
    });

    // Create templates for this route
    this.runGenerator('template', args, argv);
  }
}

module.exports = new Route;
