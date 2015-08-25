var Command = require('../command');

class Generate extends Command {
  constructor () {
    super();
    this.name = 'generate';
    this.description = 'ion generate:generator name';
  }
  run (args, argv) {
    var generator = this.findGenerator(args[0]);
    this.generators[generator].run(args, argv);
  }
}

module.exports = new Generate;