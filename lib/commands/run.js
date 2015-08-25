var Command = require('../command');
var path = require('path');

class Run extends Command {
  constructor () {
    super();
    this.name = 'run';
    this.usage = 'ion';
  }
  run (args, argv) {
    if (this.findProjectDir()) {
      console.log(args);
      console.log(argv);
      this.runMeteorCommand();
    }
  }
}

module.exports = new Run;