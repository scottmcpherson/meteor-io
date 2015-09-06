var Command = require('{{commandPath}}');

class Route extends Command {
  constructor() {
    super();
    this.alias = 'r';
    this.name = 'route';
    this.description = 'io g:{route, r} [path/]<name>';
  }
  run(args, argv) {
    var self = this;

    this.writeTemplateWithData({
      src: [self.ioTemplatesPath, 'route.js'],
      dest: [self.appPath, 'lib', 'route.js'],
      data: { name: 'demo' }
    });
  }
}

module.exports = new Route;
