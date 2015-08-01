var Command = require('../command');

class Template extends Command {
  constructor () {
    super();
    this.name = 'template',
    this.usage = 'ion {generate, g}:{template, t} [path/]<name>'
    console.log("Template is called");
  }
  run () {
    console.log("Running Template ...");
    this.writeFileWithData('template.html', { name: 'Scott'});
  }
}

module.exports = new Template;

