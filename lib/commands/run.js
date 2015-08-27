var Command = require('../command');
var path = require('path');

class Run extends Command {
  constructor () {
    super();
    this.name = 'run';
    this.description = 'io';
  }
  run (args, argv) {
    var isRun = false;

    if (!args.length || (args.length && args[0] === 'run')) {
      isRun = true;
    }

    var args = args || [];

    if (argv.port) {
      args.push('--port', argv.port);
    }

    if (this.findProjectDir()) {
      if (isRun) {
        console.log('isRun');
        this.runMeteor(args);
      } else {
        this.runMeteorCommand(args);
      }

    }
  }
}

module.exports = new Run;