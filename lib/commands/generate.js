var Command = require('../command');

class Generate extends Command {
  constructor() {
    super();
    this.alias = 'g';
    this.name = 'generate';
    this.description = 'io {g, generate}:generator <name>';
  }
  run(args, argv) {
    var generator = this.findGenerator(args[0]);
    this.runGenerator(generator, args, argv);
  }
}

module.exports = new Generate;
