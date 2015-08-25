var Command = require('{{commandPath}}');

class Route extends Command {
  constructor () {
    super();
    this.alias = 'r';
    this.name = 'route';
    this.description = 'ion g:{route, r} [path/]<name>';
  }
  run (args, argv) {
    this.writeTemplateWithData('route.js', { name: 'Scott'});
  }
}

module.exports = new Route;