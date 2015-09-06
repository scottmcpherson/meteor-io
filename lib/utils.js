var _ = require('underscore');
var FileSystem = require('./utilities/file-system');
var path = require('path');
var fs = require('fs-extra');
var exec = require('child_process').execSync;
var spawn = require('child_process').spawn;

class Utils extends FileSystem {
  constructor() {
    super();
  }
  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }
  cammelizeFileName(fileName) {
    return fileName.replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); });
  }
  removeFileNameCharacters(fileName) {
    var fileName = fileName;
    fileName = fileName.replace('-', ' ');
    fileName = fileName.replace('_', ' ');
    return fileName;
  }
  convertConstantToVariable(constant) {
    var lowerCase = constant.toLowerCase();
    var underscoreToDash = lowerCase.replace('_', '-');
    return this.cammelizeFileName(underscoreToDash);
  }
  converFileToClassName(fileName) {
    var fileName = this.removeFileNameCharacters(fileName);
    fileName = fileName.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return fileName.replace(' ', '');
  }
  makeAliasFromFileName(fileName) {
    var fileName = this.removeFileNameCharacters(fileName);
    var matches = fileName.match(/\b(\w)/g);
    var alias = matches.join('');
    return alias;
  }
  isIoUserConfigPath() {
    try {
      var ioFilePath = this._adminConfigFilePath;
      if (! ioFilePath) return false;

      var isIoFile = this.isFile(ioFilePath);
      if (! isIoFile) return false;

      var isIoUserDir = this.isDir(this.ioPath);
      return isIoUserDir;

    } catch (e) {
      this.logNoProjectFound(e);
      process.exit(1);
    }
  }
  createMeteorApp(projectPath) {
    var command = 'meteor create app';
    this.execMeteorCommandSync(command, projectPath);
  }
  createPackage(packageName) {
    var command = `meteor create ${packageName} --package`;
    var cwd = this.packagesPath;
    this.execMeteorCommandSync(command, cwd);
  }
  addPackage(packageName, appPath) {
    var command = `meteor add ${packageName}`;
    var cwd = appPath || this.appPath;
    this.execMeteorCommandSync(command, cwd);
  }
  removePackage (packageName, appPath) {
    var command = `meteor remove ${packageName}`;
    var cwd = appPath || this.appPath;
    this.execMeteorCommandSync(command, cwd);
  }
  execMeteorCommandSync(command, cwd) {
    try {
      var self = this;
      var results = exec(command, { cwd: cwd });
      this.logSuccess(results);
    } catch (e) {
      this.logError(e);
    }
  }
  runMeteor(args) {
    var self = this;
    var envPath = this.envPath;
    var settingsPath = this.settingsPath;
    var args = args || [];

    if (this.isFile(settingsPath)) {
      args.push('--settings', settingsPath);
    }

    if (this.isFile(envPath)) {
      require('dotenv').config({ path: self.envPath });
    }

    this.runMeteorCommand(args);
  }
  runMeteorCommand(args) {
    var self = this;
    var args = args || [];

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
      console.log('done');
    });
  }
};

module.exports =  Utils;
