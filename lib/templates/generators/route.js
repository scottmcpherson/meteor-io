var Command = require('{{commandPath}}');

class Route extends Command {
  constructor() {
    super();
    this.alias = 'r';
    this.name = 'route';
    this.description = 'io g:{route, r} [path/]<name>';
  }
  run(args, argv) {
    if (args.length < 2)
      throw new Error('Requires two args');

    var self = this;
    var fileBaseName = self.getBaseName(args[1]);
    var camelName = self.camelizeFileName(fileBaseName);

    console.log();

    // Create the route
    this.writeTemplateWithDataToEndOfFile({
      src: [self.ioTemplatesPath, 'route.js'],
      dest: self.config.dest,
      data: { name: fileBaseName, camelName: camelName }
    });

    // Create templates for this route
    this.runGenerator('template', args, argv);
  }
}

module.exports = new Route;
