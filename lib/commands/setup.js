var Command = require('../command');
var readline = require('readline');
var fs = require('fs-extra');
var path = require('path');

class Setup extends Command {
  constructor () {
    super();
    this.name = 'setup';
    this.usage = 'ion setup';
  }
  run (args, argv) {
    var self = this;
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log();
    console.log("First we need to set up an ion directory.");
    console.log("Specify a directory where you would like to store your generators and config.");

    rl.question("Directory: ", function(ionDest) {
      ionDest = ionDest.trim();

      if (self.isDir(ionDest)) {
        try {
          let ionInstallPath = path.join(ionDest, 'ion');

          // Create user's ion directory
          self.mkdir(ionInstallPath);

          // Create admin config with new user's ion path
          let adminConfigPath = path.join(self.adminRootDir, 'config', 'config.json');
          fs.ensureFileSync(adminConfigPath);
          fs.writeJsonSync(adminConfigPath, { ionPath: ionInstallPath });


          // Set up dirs for user's ion
          self.mkdirs([ionInstallPath, 'templates'],
                      [ionInstallPath, 'generators']);

          // Set up templates and generators
          let templatesDir = path.join(self.adminTemplatesDir, 'templates');
          let generatorsDir = path.join(self.adminTemplatesDir, 'generators');


          self.writeTemplatesWithData({
            template: [generatorsDir, 'route.js'],
            data: { commandPath: self.adminCommandPath },
            destination: [generatorsPath, 'route.js']
          }, {
            template: [generatorsDir, 'template.js'],
            data: { commandPath: self.adminCommandPath },
            destination: [generatorsPath, 'template.js']
          });


        } catch (e) {
          console.log('something here: ', e);
        }

      } else {
        throw new Error('Not a valid directory');
      }

      rl.close();
    });
  }
}

module.exports = new Setup;