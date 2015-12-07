var fs = require('fs-extra');
var path = require('path');
var _  = require('lodash');
var Handlebars = require('handlebars');
var appDir = path.dirname(require.main.filename);
var Logger  = require('./logger');
var readlineSync = require('readline-sync');
var store = require('data-store')('io');

class FileSystem extends Logger {
  // For the user.
  get ioTemplatesPath() {
    var templatesPath = path.join(this.ioPath, 'templates');
    return templatesPath;
  }

  // Useful generator and command variables
  get projectPath() {
    return this.findProjectDir();
  }
  get appPath() {
    return path.join(this.projectPath, 'app');
  }
  get packagesPath() {
    return path.join(this.projectPath, 'app', 'packages');
  }
  get settingsPath() {
    return path.join(this.projectPath, 'config', 'development', 'settings.json');
  }
  get envPath() {
    return path.join(this.projectPath, 'config', 'development', 'env.sh');
  }
  get globalConfig() {
    var globalConfigPath = this.join(this.ioPath, '.io', 'config.json');
    var globalJson = fs.readJsonSync(globalConfigPath);
    return globalJson;
  }
  get localConfig() {
    var localConfigPath = this.join(this.projectPath, '.io', 'config.json');
    var localJson = fs.readJsonSync(localConfigPath);
    return localJson;
  }
  get configFile() {
    try {
      var globalConfig = this.globalConfig;
      var localConfig = this.localConfig;
      var json = _.merge(globalConfig, localConfig);
      return json;
    } catch (e) {
      this.logError(e);
      return false;
    }
  }

  // Internal Variables
  get _adminLibPath() {
    return path.join(this._adminRootDir, 'lib');
  }
  get _adminCommandPath() {
    return path.join(this._adminLibPath, 'command.js');
  }
  get _adminRootDir() {
    return appDir.replace('/bin', '');
  }
  get _adminConfigPath() {
    return path.join(this._adminRootDir, 'config');
  }
  get _adminTemplatesDir() {
    return path.join(this._adminLibPath, 'templates');
  }
  get _adminGeneratorsDir() {
    return path.join(this._adminLibPath, 'generators');
  }

  get ioPath() {
    return store.get('usersIoPath');
  }

  // Files, directories, and templates
  isDir(dir) {
    try {
      var stat = fs.statSync(dir);
      return stat.isDirectory();
    } catch (e) {
      return false;
    }
  }
  isFile(file) {
    try {
      return fs.statSync(file).isFile();
    } catch (e) {
      return false;
    }
  }
  mkdir(dir) {
    var self = this;
    var dir = dir;
    if (_.isArray(dir)) {
      dir = this.joinArray(dir);
    }
    fs.ensureDirSync(dir);
    self.logSuccess('Created dir: ', dir);
  }
  mkdirs(...dirs) {
    var self = this;
    _.each(dirs, function(dir) {
      self.mkdir(dir);
    });
  }
  outputJson(file, data) {
    fs.outputJsonSync(file, data);
  }
  copy(src, dest) {
    var self = this;
    var src = src;
    var dest = dest;

    if (_.isArray(src)) {
      src = this.joinArray(src);
    }
    if (_.isArray(dest)) {
      dest = this.joinArray(dest);
    }
    self.confirmFileOverwriteIfExists(dest);
    fs.copySync(src, dest);
  }
  copyAll(...dirGroups) {
    var self = this;
    _.each(dirGroups, function(dirGroup) {
      if (dirGroup.hasOwnProperty('src') && dirGroup.hasOwnProperty('dest')) {
        return self.copy(dirGroup.src, dirGroup.dest);
      }
      return self.logError('copyAll needs a src and a dest');
    });
  }
  remove(dir) {
    var dir = dir;
    if (_.isArray(dir)) {
      dir = this.joinArray(dir);
    }
    fs.removeSync(dir);
  }
  removeAll(...dirs) {
    var self = this;
    _.each(dirs, function(dir) {
      self.remove(dir);
    });
  }
  join(...paths) {
    return path.join.apply(null, paths);
  }
  joinArray(arr) {
    return path.join.apply(null, arr);
  }
  getDirName(fullPath) {
    var dirname = path.dirname(fullPath);
    return dirname;
  }
  getBaseName(fullPath) {
    var basename = path.basename(fullPath);
    return basename;
  }

  // XXX: Smarter defaults and checking needed.
  writeTemplateWithData(opts, isAddToEndOfExistingFile) {
    opts = opts || {};
    var self = this;
    var src = opts.src || '';
    var dest = opts.dest || '';
    var isAddToEndOfExistingFile = isAddToEndOfExistingFile || false;

    if (_.isArray(src)) {
      src = this.joinArray(src);
    }

    if (_.isArray(dest)) {
      dest = this.joinArray(dest);
    }

    var source = this.getSource(src);
    var compiledTemplate = this.compile(source);
    var data = opts.data || {};
    var result = compiledTemplate(data);

    if (!isAddToEndOfExistingFile) {
      self.confirmFileOverwriteIfExists(dest);
      fs.ensureFileSync(dest);
      fs.writeFileSync(dest, result);
    } else {
      fs.ensureFileSync(dest);
      fs.appendFileSync(dest, result);
    }

    self.logSuccess('Created template: ', dest);
  }
  writeTemplatesWithData(...templates) {
    var self = this;
    _.each(templates, function(template) {
      self.writeTemplateWithData(template);
    });
  }
  writeTemplateWithDataToEndOfFile(opts) {
    this.writeTemplateWithData(opts, true);
  }
  writeFile(file) {
    var self = this;
    self.confirmFileOverwriteIfExists(file);
    fs.ensureFileSync(file);
    self.logSuccess('Created file: ', file);
  }
  getSource(filePath) {
    var source = fs.readFileSync(filePath, 'utf8');
    return source;
  }
  compile(source) {
    return Handlebars.compile(source);
  }
  confirmFileOverwriteIfExists(file) {
    var self = this;
    if (self.isFile(file)) {
      self.logError(`File already exists: ${file}`);
      if (!readlineSync.keyInYNStrict('Do you want to overwrite it?')) {
        process.exit();
      }
    }
  }

  // For now, we'll just check three levels.
  findProjectDir() {
    try {
      var base = process.cwd();
      var firstLevel = path.join(base, '.io');
      var secondBase = path.dirname(base);
      var secondLevel = path.join(secondBase, '.io');
      var thirdBase = path.dirname(secondBase);
      var thirdLevel = path.join(thirdBase, '.io');

      if (this.isDir(firstLevel)) {
        return base;
      } else if (this.isDir(secondLevel)) {
        return secondBase;
      } else if (this.isDir(thirdLevel)) {
        return thirdBase;
      } else {
        this.logNoProjectFound();
        process.exit(1);
      }
    } catch (e) {
      // XXX: Need to inform the user that
      // they are not in a project, and possibly
      // log a usage or helper error.
      this.logNoProjectFound();
      process.exit(1);
    }

  }

  // For now, we'll just check three levels.
  isProjectDir() {
    try {
      var base = process.cwd();
      var firstLevel = path.join(base, '.io');
      var secondBase = path.dirname(base);
      var secondLevel = path.join(secondBase, '.io');
      var thirdBase = path.dirname(secondBase);
      var thirdLevel = path.join(thirdBase, '.io');

      if (this.isDir(firstLevel) ||
          this.isDir(secondLevel) ||
          this.isDir(thirdLevel))
      {
        return true;
      }
    } catch (e) {
      return false;
    }

  }
}

module.exports = FileSystem;
