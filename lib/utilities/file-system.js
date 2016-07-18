const fs = require('fs-extra');
const path = require('path');
const _  = require('lodash');
const Handlebars = require('handlebars');
const appDir = path.dirname(require.main.filename);
const Logger  = require('./logger');
const readlineSync = require('readline-sync');
const store = require('data-store')('io');

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
    const globalConfigPath = this.join(this.ioPath, '.io', 'config.json');
    const globalJson = fs.readJsonSync(globalConfigPath);
    return globalJson;
  }
  get localConfig() {
    const localConfigPath = this.join(this.projectPath, '.io', 'config.json');
    const localJson = fs.readJsonSync(localConfigPath);
    return localJson;
  }
  get configFile() {
    try {
      const globalConfig = this.globalConfig;
      const localConfig = this.localConfig;
      const json = _.merge(globalConfig, localConfig);
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
    return appDir.replace(path.sep + 'bin', '');
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
      const stat = fs.statSync(dir);
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
    if (_.isArray(dir)) {
      dir = this.joinArray(dir);
    }
    fs.ensureDirSync(dir);
    this.logSuccess('Created dir: ', dir);
  }
  mkdirs(...dirs) {
    _.each(dirs, (dir) => {
      this.mkdir(dir);
    });
  }
  outputJson(file, data) {
    fs.outputJsonSync(file, data);
  }
  copy(src, dest) {
    if (_.isArray(src)) {
      src = this.joinArray(src);
    }
    if (_.isArray(dest)) {
      dest = this.joinArray(dest);
    }
    this.confirmFileOverwriteIfExists(dest);
    fs.copySync(src, dest);
  }
  copyAll(...dirGroups) {
    _.each(dirGroups, (dirGroup) => {
      if (dirGroup.hasOwnProperty('src') && dirGroup.hasOwnProperty('dest')) {
        return this.copy(dirGroup.src, dirGroup.dest);
      }
      return this.logError('copyAll needs a src and a dest');
    });
  }
  remove(dir) {
    if (_.isArray(dir)) {
      dir = this.joinArray(dir);
    }
    fs.removeSync(dir);
  }
  removeAll(...dirs) {
    _.each(dirs, (dir) => {
      this.remove(dir);
    });
  }
  join(...paths) {
    return path.join.apply(null, paths);
  }
  joinArray(arr) {
    return path.join.apply(null, arr);
  }
  getDirName(fullPath) {
    return path.dirname(fullPath);
  }
  getBaseName(fullPath) {
    return path.basename(fullPath);
  }

  // XXX: Smarter defaults and checking needed.
  writeTemplateWithData(opts = {}, isAddToEndOfExistingFile = false) {
    let src = opts.src || '';
    let dest = opts.dest || '';

    if (_.isArray(src)) {
      src = this.joinArray(src);
    }

    if (_.isArray(dest)) {
      dest = this.joinArray(dest);
    }

    var source = this.getTemplateSource(src);
    var compiledTemplate = this.compile(source);
    var data = opts.data || {};
    var result = compiledTemplate(data);

    if (!isAddToEndOfExistingFile) {
      this.confirmFileOverwriteIfExists(dest);
      fs.ensureFileSync(dest);
      fs.writeFileSync(dest, result);
    } else {
      fs.ensureFileSync(dest);
      fs.appendFileSync(dest, result);
    }

    this.logSuccess('Created template: ', dest);
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
    if (_.isArray(file)) {
      file = this.joinArray(file);
    }
    this.confirmFileOverwriteIfExists(file);
    fs.ensureFileSync(file);
    this.logSuccess('Created file: ', file);
  }
  writeImportToFile(file, importStatement) {
    if (_.isArray(file)) {
      file = this.joinArray(file);
    }
    const fileContents = fs.readFileSync(file, 'utf8');

    let strt = fileContents.lastIndexOf('\nimport ');
    strt = fileContents.indexOf('\n', strt + 1);
    const result = fileContents.splice(strt + 1, 0, importStatement)

    fs.writeFileSync(file, result, 'utf8');
  }
  getSource(filePath) {
    var source = fs.readFileSync(filePath, 'utf8');
    return source;
  }
  getTemplateSource(fileName) {
    let srcPath = this.join(this.ioTemplatesPath, fileName);

    if (this.isFile(srcPath)) {
      return this.getSource(srcPath);
    } else {

      srcPath = this.join(this._adminTemplatesDir, 'templates', fileName);
      if (this.isFile(srcPath)) {
        return this.getSource(srcPath);
      } else {
        this.logError(`Template does not exist: ${srcPath}`);
      }
    }
  }
  compile(source) {
    return Handlebars.compile(source);
  }
  confirmFileOverwriteIfExists(file) {
    if (this.isFile(file)) {
      this.logError(`File already exists: ${file}`);
      if (!readlineSync.keyInYNStrict('Do you want to overwrite it?')) {
        process.exit();
      }
    }
  }

  // For now, we'll just check three levels.
  findProjectDir() {
    try {
      const base = process.cwd();
      const firstLevel = path.join(base, '.io');
      const secondBase = path.dirname(base);
      const secondLevel = path.join(secondBase, '.io');
      const thirdBase = path.dirname(secondBase);
      const thirdLevel = path.join(thirdBase, '.io');

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
      const base = process.cwd();
      const firstLevel = path.join(base, '.io');
      const secondBase = path.dirname(base);
      const secondLevel = path.join(secondBase, '.io');
      const thirdBase = path.dirname(secondBase);
      const thirdLevel = path.join(thirdBase, '.io');

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

String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

module.exports = FileSystem;
