var Command = require('{{commandPath}}');

class {{upperCaseName}} extends Command {
  constructor () {
    super();
    this.name = '{{name}}';
    this.usage = 'ion g:{{name}}';
  }
  run () {
    // Generator code here
  }
}

module.exports = new {{upperCaseName}};