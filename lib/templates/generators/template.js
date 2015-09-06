var Command = require('{{commandPath}}');

class Template extends Command {
  constructor() {
    super();
    this.alias = 't';
    this.name = 'template';
    this.description = 'io g:{template, t} [path/]<name>';
  }
  run(args, argv) {
    var self = this;

    this.writeTemplateWithData({
      src: [self.ioTemplatesPath, 'template.html'],
      dest: [self.appPath, 'client', 'templates', 'template.html'],
      data: { name: 'demo' }
    });
  }
}

module.exports = new Template;
