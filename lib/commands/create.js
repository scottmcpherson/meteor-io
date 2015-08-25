var Command = require('../command');
var path = require('path');

class Create extends Command {
  constructor () {
    super();
    this.name = 'create';
    this.description = 'ion create project-name';
  }
  run (args, argv) {
    var self = this;

    if (args.length < 2 && !argv.generator)
      throw new Error('Need to give your project a name');

    if (argv.generator) {
      // XXX: Need to have this auto name the
      // file with a smart, default extension
      let generatorName = args[1];
      let upperCaseName = this.capitalize(generatorName);
      let userIonGeneratorPath = path.join(this._adminCofigUsersPath, 'generators', 'rp.js');
      let templatePath = path.join(this._adminRootDir, 'config', 'generator.js')

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

    // Can't use the projectPath getter here
    // because the project doesn't exist yet
    var projectName = args[1];
    var projectPath = path.join(process.cwd(), projectName);
    var appPath = path.join(projectPath, 'app');

    this.mkdirs(projectPath,
               [projectPath, '.ion'],
               [projectPath, 'config', 'development']);


    var adminTemplatesPath = path.join(this._adminTemplatesDir, 'templates');

    console.log('adminTemplatesPath', adminTemplatesPath);

    self.copy([adminTemplatesPath, 'env.sh'],
              [projectPath, 'config', 'development', 'env.sh']);


    this.createMeteorApp(projectPath);

    this.removeAll([appPath, 'app.css'],
                   [appPath, 'app.html'],
                   [appPath, 'app.js']);

    this.mkdirs([appPath, 'lib'],
                [appPath, 'client'],
                [appPath, 'server'],
                [appPath, 'public'],
                [appPath, 'packages']);
  }
}

module.exports = new Create;