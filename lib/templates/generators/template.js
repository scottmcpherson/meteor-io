var Command = require('{{commandPath}}');

class Template extends Command {
  constructor () {
    super();
    this.name = 'template',
    this.usage = 'ion {generate, g}:{template, t} [path/]<name>'
    console.log("Template is called");
  }
  run (args, argv) {

    console.log("Running Template ...");
    this.writeTemplateWithData('template.html', { name: 'Scott'});
  }
}

module.exports = new Template;

