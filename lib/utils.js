var _ = require('underscore');
var FileSystem = require('./utilities/file-system');
var path = require('path');
var fs = require('fs-extra');
var exec = require('child_process').execSync;
var spawn = require('child_process').spawn;
var store = require('data-store')('io');

class Utils extends FileSystem {
  constructor() {
    super();
  }
  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }
  camelizeFileName(fileName) {
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
    return this.camelizeFileName(underscoreToDash);
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
    if (!store.has('usersIoPath')) {
      return false;
    }
    var configFile = path.join(store.get('usersIoPath'), '.io', 'config.json');
    return this.isFile(configFile);
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
  removePackage(packageName, appPath) {
    var command = `meteor remove ${packageName}`;
    var cwd = appPath || this.appPath;
    this.execMeteorCommandSync(command, cwd);
  }
  execCommandSync(command, cwd) {
    try {
      var results = exec(command, { cwd: cwd });
      return results;
    } catch (e) {
      this.logError(e);
    }
  }
  execMeteorCommandSync(command, cwd) {
    var results = this.execCommandSync(command, cwd);
    this.logSuccess(results);
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
  getMeteorVersion() {
    var command = 'meteor --version';
    var results = this.execCommandSync(command, this.appPath);
    var resultStr = results.toString('utf-8');
    return resultStr.replace(/[^\d.-]/g, '');
  }
};

module.exports =  Utils;
