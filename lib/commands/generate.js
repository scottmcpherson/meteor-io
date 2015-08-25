var Command = require('../command');

class Generate extends Command {
  constructor () {
    super();
    this.alias = 'g';
    this.name = 'generate';
    this.description = 'ion {g, generate}:generator <name>';
  }
  run (args, argv) {
    var generator = this.findGenerator(args[0]);
    console.log('from the outside: ', generator)
    this.generators[generator].run(args, argv);
  }
}

module.exports = new Generate;