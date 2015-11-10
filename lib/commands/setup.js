var Command = require('../command');
var fs = require('fs-extra');
var path = require('path');
var readlineSync = require('readline-sync');
var store = require('data-store')('io');

class Setup extends Command {
  constructor() {
    super();
    this.name = 'setup';
    this.description = 'io setup';
  }
  run(args, argv) {
    var self = this;

    console.log();
    console.log('First we need to set up an io directory.');
    console.log();
    console.log('Specify an existing directory where you would like to store your generators, templates, and config.');
    console.log();

    var ioDest = readlineSync.question('Directory: ');
    ioDest = ioDest.trim();

    if (self.isDir(ioDest)) {
      try {
        let ioInstallPath = path.join(ioDest, 'io');

        console.log();

        // Create user's io directory
        self.mkdir(ioInstallPath);

        // Save the user's io path to disk
        store.set('usersIoPath', ioInstallPath);

        // Set up dirs for user's io
        self.mkdirs([ioInstallPath, 'templates'],
                    [ioInstallPath, 'generators'],
                    [ioInstallPath, '.io']);

        console.log();

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
        }, {
          src: [generatorsPath, 'package.js'],
          dest: [generatorsDestPath, 'package.js'],
          data: { commandPath: self._adminCommandPath }
        });

        self.copyAll({
          src: [templatesPath, 'route.js'],
          dest: [templatesDestPath, 'route.js']
        }, {
          src: [templatesPath, 'template.html'],
          dest: [templatesDestPath, 'template.html']
        }, {
          src: [templatesPath, 'template.js'],
          dest: [templatesDestPath, 'template.js']
        }, {
          src: [templatesPath, 'package.js'],
          dest: [templatesDestPath, 'package.js']
        });

        console.log();
        self.logSuccess('io successfully installed at: ' + ioInstallPath);
        console.log();

      } catch (e) {
        console.log(e);
      }

    } else {
      throw new Error('Not a valid directory. Make sure the directory already exists.');
    }

  }
}

module.exports = new Setup;
