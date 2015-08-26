var Command = require('../command');

class Generate extends Command {
  constructor () {
    super();
    this.alias = 'g';
    this.name = 'generate';
    this.description = 'io {g, generate}:generator <name>';
  }
  run (args, argv, commandName) {
    var generator = this.findGenerator(args[0]);

    if (args.length > 1) {
      args = args.shift();
    } else {
      args = [];
    }

    this.generators[generator].bindGeneratorConfig(generator);
    this.generators[generator].run(args, argv);
  }
}

module.exports = new Generate;