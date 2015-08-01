var Command = require('../command');

class Skrillex extends Command {
  constructor () {
    super();
    this.name = 'skrillex',
    this.usage = 'ion {generate, g}:{skrillex, t} [path/]<name>'
    console.log("Skrillex is called");
  }
  run () {
    console.log("Running Skrillex ...");
    this.writeFileWithData('route.js', { name: 'Scott'});
  }
}

module.exports = new Skrillex;