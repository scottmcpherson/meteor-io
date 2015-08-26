var Command = require('../command');
var path = require('path');
var _ = require('underscore');

class Create extends Command {
  constructor () {
    super();
    this.name = 'create';
    this.description = 'io create <project-name>, io create <generator-name> --generator';
  }
  run (args, argv) {
    var self = this;

    if (args.length < 2 && !argv.generator)
      throw new Error('Need to give your project a name');

    if (argv.generator && args.length > 1) {
      // XXX: Need to give the file a
      // smart default name and extension
      let generatorName = args[1];
      let generatorFileName = generatorName + '.js';
      let className = this.converFileToClassName(generatorName);
      let userIoGeneratorPath = path.join(self.ioPath, 'generators', generatorFileName);

      this.writeTemplateWithData({
        src: [this._adminConfigPath, 'generator.js'],
        dest: userIoGeneratorPath,
        data: {
          commandPath: self._adminCommandPath,
          name: generatorName,
          className: className,
          alias: self.makeAliasFromFileName(generatorName)
        }
      });

      console.log();
      self.logSuccess('Generator created: ', userIoGeneratorPath);
      console.log();

      return process.exit(1);
    }

    // Can't use the projectPath getter here
    // because the project doesn't exist yet
    var projectName = args[1];
    var projectPath = path.join(process.cwd(), projectName);
    var appPath = path.join(projectPath, 'app');

    this.mkdirs(projectPath,
               [projectPath, 'config', 'development']);

    var adminTemplatesPath = path.join(this._adminTemplatesDir, 'templates');
    var ioPath = path.join(projectPath, '.io', 'config.json');
    var ioSrcPath = path.join(adminTemplatesPath, 'admin-config.json');

    self.writeFile(ioPath);
    self.copy(ioSrcPath, ioPath);
    self.copy([adminTemplatesPath, 'env.sh'],
              [projectPath, 'config', 'development', 'env.sh']);

    this.createMeteorApp(projectPath);

    if (isPackagesToRemove.call(self)) {
      let packagesToRemove = self.config.packages.remove;
      _.each(packagesToRemove, function (name) {
        self.removePackage(name, path.join(projectPath, 'app'));
      });
    }

    if (isPackagesToAdd.call(self)) {
      let packagesToAdd = self.config.packages.add;
      _.each(packagesToAdd, function (name) {
        self.addPackage(name, path.join(projectPath, 'app'));
      });
    }

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


function isPackagesToRemove() {
  var self = this;
  return  self.config &&
          self.config.packages &&
          self.config.packages.remove &&
          self.config.packages.remove.length;
};

function isPackagesToAdd() {
  var self = this;
  return  self.config &&
          self.config.packages &&
          self.config.packages.add &&
          self.config.packages.add.length;
};