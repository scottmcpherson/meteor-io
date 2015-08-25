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
      this.logError(e);
      return false;
    }
  }
  createMeteorApp (projectPath) {
    try {
      var results = exec('meteor create app', { cwd: projectPath });
      this.logSuccess(results);
    } catch (e) {
      this.logError(e);
      return false;
    }
  }
  createPackage (packageName) {
    try {
      var self = this;
      var command = `meteor create ${packageName} --package`;
      var results = exec(command, { cwd: self.packagesPath });
      this.logSuccess(results);
    } catch (e) {
      this.logError(e);
      return false;
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