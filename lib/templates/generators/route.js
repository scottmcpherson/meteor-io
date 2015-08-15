var Command = require('{{commandPath}}');

class Route extends Command {
  constructor () {
    super();
    this.name = 'route',
    this.usage = 'ion {generate, g}:{route, r} [path/]<name>'
    console.log("Route is called");
  }
  run (args, argv) {
    console.log("Running Route ...");
    this.writeTemplateWithData('route.js', { name: 'Scott'});
  }
}

module.exports = new Route;