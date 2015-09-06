var Command = require('{{commandPath}}');
var path = require('path');

class {{className}} extends Command {
  constructor () {
    super();
    // A shorter name to call your generator with
    this.alias = '{{alias}}';
    // This name should match the file name without the extension
    this.name = '{{name}}';
    // A brief description on how to use
    this.description = 'io {{name}} [args], io {{alias}} [args]';
  }
  run(args, argv) {
    // Command code here
  }
}

module.exports = new {{className}};
