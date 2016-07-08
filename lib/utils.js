const _ = require('underscore');
const FileSystem = require('./utilities/file-system');
const path = require('path');
const fs = require('fs-extra');
const exec = require('child_process').execSync;
const spawn = require('child_process').spawn;
const store = require('data-store')('io');

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
    fileName = fileName.replace('-', ' ');
    fileName = fileName.replace('_', ' ');
    return fileName;
  }
  convertConstantToVariable(constant) {
    const lowerCase = constant.toLowerCase();
    const underscoreToDash = lowerCase.replace('_', '-');
    return this.camelizeFileName(underscoreToDash);
  }
  converFileToClassName(fileName) {
    fileName = this.removeFileNameCharacters(fileName);
    fileName = fileName.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return fileName.replace(' ', '');
  }
  makeAliasFromFileName(fileName) {
    fileName = this.removeFileNameCharacters(fileName);
    const matches = fileName.match(/\b(\w)/g);
    const alias = matches.join('');
    return alias;
  }
  isIoUserConfigPath() {
    if (!store.has('usersIoPath')) {
      return false;
    }
    const configFile = path.join(store.get('usersIoPath'), '.io', 'config.json');
    return this.isFile(configFile);
  }
  createMeteorApp(projectPath) {
    const command = 'meteor create app';
    this.execMeteorCommandSync(command, projectPath);
  }
  createPackage(packageName) {
    const command = `meteor create ${packageName} --package`;
    const cwd = this.packagesPath;
    this.execMeteorCommandSync(command, cwd);
  }
  installNPMPackage(packageName, appPath) {
    const command = `meteor npm install --save ${packageName}`;
    const cwd = appPath || this.appPath;
    this.execMeteorCommandSync(command, cwd);
  }
  addPackage(packageName, appPath) {
    const command = `meteor add ${packageName}`;
    const cwd = appPath || this.appPath;
    this.execMeteorCommandSync(command, cwd);
  }
  removePackage(packageName, appPath) {
    const command = `meteor remove ${packageName}`;
    const cwd = appPath || this.appPath;
    this.execMeteorCommandSync(command, cwd);
  }
  execCommandSync(command, cwd) {
    try {
      const results = exec(command, { cwd: cwd });
      return results;
    } catch (e) {
      this.logError(e);
    }
  }
  execMeteorCommandSync(command, cwd) {
    const results = this.execCommandSync(command, cwd);
    this.logSuccess(results);
  }
  runMeteor(args = []) {
    const envPath = this.envPath;
    const settingsPath = this.settingsPath;

    if (this.isFile(settingsPath)) {
      args.push('--settings', settingsPath);
    }

    if (this.isFile(envPath)) {
      require('dotenv').config({ path: envPath });
    }

    this.runMeteorCommand(args);
  }
  runMeteorCommand(args = []) {

    spawn('meteor', args, {
      cwd: this.appPath,
      stdio: 'inherit'
    });
  }
  getMeteorVersion() {
    const command = 'meteor --version';
    const results = this.execCommandSync(command, this.appPath);
    const resultStr = results.toString('utf-8');
    return resultStr.replace(/[^\d.-]/g, '');
  }
};

module.exports =  Utils;
