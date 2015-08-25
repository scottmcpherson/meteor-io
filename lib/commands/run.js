var Command = require('../command');
var path = require('path');

class Run extends Command {
  constructor () {
    super();
    this.name = 'run';
    this.description = 'ion';
  }
  run (args, argv) {
    if (this.findProjectDir()) {
      this.runMeteorCommand();
    }
  }
}

module.exports = new Run;