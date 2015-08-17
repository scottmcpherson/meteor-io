var Command = require('../command');
var path = require('path');

class Create extends Command {
  constructor () {
    super();
    this.name = 'create';
    this.usage = 'ion create project-name';
  }
  run (args, argv) {
    var self = this;

    if (args.length < 2 && !argv.generator)
      throw new Error('Need to give your project a name');

    if (argv.generator) {
      // XXX Need to have this auto name the
      // file with a smart default extension
      let generatorName = args[1];
      let upperCaseName = this.capitalize(generatorName);
      let userIonGeneratorPath = path.join(this.ionAdminConfigUsersPath, 'generators', 'rp.js');
      let templatePath = path.join(this.adminRootDir, 'config', 'generator.js')

      this.writeTemplateWithData({
        template: templatePath,
        data: {
          commandPath: self.commandPath,
          name: generatorName,
          upperCaseName: upperCaseName
        },
        destination: userIonGeneratorPath
      });
      return;
    }

    var projectName = args[1];
    var projectPath = path.join(process.cwd(), projectName);
    var projectAppPath = path.join(projectPath, 'app');

    this.mkdirs(projectPath, [projectPath, '.ion']);
    this.createMeteorApp(projectPath);

    this.removeAll([projectAppPath, 'app.css'],
                   [projectAppPath, 'app.html'],
                   [projectAppPath, 'app.js']);

    this.mkdirs([projectAppPath, 'lib'],
                [projectAppPath, 'client'],
                [projectAppPath, 'server'],
                [projectAppPath, 'public'],
                [projectAppPath, 'packages']);


  }
}

module.exports = new Create;