var _ = require('underscore');
var FileSystem = require('./utilities/file-system');
var path = require('path');
var fs = require('fs-extra');
var exec = require('child_process').execSync
var spawn = require('child_process').spawn;

class Utils extends FileSystem {
  constructor () {
    super();
  }
  capitalize (s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }
  isIonUserConfigPath () {
    try {
      var ionFilePath = this._adminConfigPath;
      if (! ionFilePath) return false;

      var isIonFile = this.isFile(ionFilePath);
      if (! isIonFile) return false;

      var isIonUserDir = this.isDir(this.ionPath);
      return isIonUserDir;

    } catch (e) {
      this.logNoProjectFound(e);
      process.exit(1);
    }
  }
  createMeteorApp (projectPath) {
    var command = 'meteor create app';
    this.execMeteorCommandSync(command, projectPath);
  }
  createPackage (packageName) {
    var command = `meteor create ${packageName} --package`;
    var cwd = this.packagesPath;
    this.execMeteorCommandSync(command, cwd);
  }
  addPackage (packageName, appPath) {
    var command = `meteor add ${packageName}`;
    var cwd = appPath || this.appPath;
    this.execMeteorCommandSync(command, cwd);
  }
  removePackage (packageName, appPath) {
    var command = `meteor remove ${packageName}`;
    var cwd = appPath || this.appPath;
    this.execMeteorCommandSync(command, cwd);
  }
  execMeteorCommandSync (command, cwd) {
    try {
      var self = this;
      var results = exec(command, { cwd: cwd });
      this.logSuccess(results);
    } catch (e) {
      this.logError(e);
    }
  }
  runMeteorCommand (args) {
    var self = this;
    var args = [];
    var envPath = this.envPath;
    var settingsPath = this.settingsPath;

    if (this.isFile(settingsPath)) {
      args.push('--settings', settingsPath);
    }

    if (this.isFile(envPath)) {
      require('dotenv').config({ path: self.envPath });
    }

    var child = spawn('meteor', args, {
      cwd: this.appPath
    });

    child.stdout.on('data', function stdout(data) {
      console.log(data.toString());
    });

    child.stderr.on('data', function stderr(data) {
      console.error(data.toString());
    });

    child.on('exit', function() {
      console.log("done");
    });
  }
};

module.exports =  Utils;