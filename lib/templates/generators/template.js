var Command = require('{{commandPath}}');

class Template extends Command {
  constructor () {
    super();
    this.alias = 't';
    this.name = 'template';
    this.description = 'ion g:{template, t} [path/]<name>';
  }
  run (args, argv) {
    this.writeTemplateWithData('template.html', { name: 'Scott'});
  }
}

module.exports = new Template;

