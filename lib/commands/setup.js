var Command = require('../command');
var readline = require('readline');
var fs = require('fs-extra');
var path = require('path');

class Setup extends Command {
  constructor () {
    super();
    this.name = 'setup';
    this.description = 'io setup';
  }
  run (args, argv) {
    var self = this;
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log();
    console.log("First we need to set up an io directory.");
    console.log("Specify a directory where you would like to store your generators, commands, and config.");

    rl.question("Directory: ", function(ioDest) {
      ioDest = ioDest.trim();

      if (self.isDir(ioDest)) {
        try {
          let ioInstallPath = path.join(ioDest, 'io');

          // Create user's io directory
          self.mkdir(ioInstallPath);

          // Create admin config with new user's io path
          let _adminConfigPath = path.join(self._adminRootDir, 'config', 'config.json');
          fs.outputJsonSync(_adminConfigPath, { ioPath: ioInstallPath });

          // Set up dirs for user's io
          self.mkdirs([ioInstallPath, 'templates'],
                      [ioInstallPath, 'generators'],
                      [ioInstallPath, '.io']);


          // Set up templates and generators
          let generatorsPath = path.join(self._adminTemplatesDir, 'generators');
          let generatorsDestPath = path.join(ioInstallPath, 'generators');

          let templatesPath = path.join(self._adminTemplatesDir, 'templates');
          let templatesDestPath = path.join(ioInstallPath, 'templates');


          // Set up global config file
          self.copy([templatesPath, 'config.json'],
                    [ioInstallPath, '.io', 'config.json']);


          self.writeTemplatesWithData({
            src: [generatorsPath, 'route.js'],
            dest: [generatorsDestPath, 'route.js'],
            data: { commandPath: self._adminCommandPath }
          }, {
            src: [generatorsPath, 'template.js'],
            dest: [generatorsDestPath, 'template.js'],
            data: { commandPath: self._adminCommandPath }
          });


          self.copyAll({
            src: [templatesPath, 'route.js'],
            dest: [templatesDestPath, 'route.js']
          }, {
            src: [templatesPath, 'template.html'],
            dest: [templatesDestPath, 'template.html']
          });

          console.log();
          self.logSuccess('io successfully installed at: ' + ioInstallPath);
          console.log();

        } catch (e) {
          console.log(e);
        }

      } else {
        throw new Error('Not a valid directory');
      }

      rl.close();
    });
  }
}

module.exports = new Setup;