var fs = require('fs-extra');
var path = require('path');
var _  = require('underscore');
var Handlebars = require('handlebars');
var appDir = path.dirname(require.main.filename);
var Logger  = require('./logger');

class FileSystem extends Logger {
  // For the user.
  get templatesPath () {
    var templatesPath = path.join(this.ionPath, 'templates');
    return templatesPath;
  }

  // Useful generator and command variables
  get projectPath () {
    return this.findProjectDir();
  }
  get appPath () {
    return path.join(this.projectPath, 'app');
  }
  get packagesPath () {
    return path.join(this.projectPath, 'app', 'packages');
  }
  get settingsPath () {
    return path.join(this.projectPath, 'config', 'development', 'settings.json');
  }
  get envPath () {
    return path.join(this.projectPath, 'config', 'development', 'env.sh');
  }


  // Internal Variables
  get _adminCommandPath () {
    return path.join(this._adminRootDir, 'lib', 'command.js');
  }
  get _adminRootDir () {
    return appDir.replace('/bin', '');
  }
  get _adminConfigPath () {
    return path.join(this._adminRootDir, 'config', 'config.json');
  }
  get _adminTemplatesDir () {
    return path.join(this._adminRootDir, 'lib', 'templates');
  }
  get _adminCofig () {
    try {
      var json = fs.readJsonSync(this._adminConfigPath);
      return json;
    } catch (e) {
      this.logError(e);
      return false;
    }
  }
  get ionPath () {
    return this._adminCofig.ionPath;
  }
  get ionTemplates () {
    var self = this;
    return this.join(self._adminCofig.ionPath, 'templates');
  }


  // Files, directories, and templates
  isDir (dir) {
    try {
      return fs.statSync(dir).isDirectory();
    } catch (e) {
      return false;
    }
  }
  isFile (file) {
    try {
      return fs.statSync(file).isFile();
    } catch (e) {
      return false;
    }
  }
  mkdir (dir) {
    var dir = dir;
    if (_.isArray(dir)) {
      dir = this.joinArray(dir);
    }
    fs.ensureDirSync(dir);
  }
  mkdirs (...dirs) {
    var self = this;
    _.each(dirs, function (dir) {
      self.mkdir(dir);
    });
  }
  copy (src, dest) {
    var src = src;
    var dest = dest;
    if (_.isArray(src)) {
      src = this.joinArray(src);
    }
    if (_.isArray(dest)) {
      dest = this.joinArray(dest);
    }
    fs.copySync(src, dest);
  }
  copyAll (...dirGroups) {
    var self = this;
    _.each(dirGroups, function (dirGroup) {
      if (dirGroup.hasOwnProperty('src') && dirGroup.hasOwnProperty('dest')) {
        return self.copy(dirGroup.src, dirGroup.dest);
      }
      return self.logError('copyAll needs a src and a dest');
    });
  }
  remove (dir) {
    var dir = dir;
    if (_.isArray(dir)) {
      dir = this.joinArray(dir);
    }
    fs.removeSync(dir);
  }
  removeAll (...dirs) {
    var self = this;
    _.each(dirs, function (dir) {
      self.remove(dir);
    });
  }
  join (...paths) {
    return path.join.apply(null, paths);
  }
  joinArray (arr) {
    return path.join.apply(null, arr);
  }
  // XXX: Rename this to writeFile?
  writeTemplate (template) {
    var dir = path.join(this._adminRootDir, template);
    var file = fs.readFileSync(dir);
    // TODO: Write file somewhere
  }
  // XXX: Rename this to writeFiles?
  writeTemplates (...templates) {
    _.each(templates, function (template) {
      this.writeTemplate(template);
    });
  }
  // XXX: Smarter defaults and checking needed.
  writeTemplateWithData (opts) {
    opts = opts || {};
    var src = opts.src || '';
    var dest = opts.dest || '';

    if (_.isArray(src))
      src = this.joinArray(src);

    if (_.isArray(dest))
      dest = this.joinArray(dest);

    var source = this.getSource(src);
    var compiledTemplate = this.compile(source);
    var data = opts.data || {};
    var result = compiledTemplate(data);

    fs.ensureFileSync(dest);
    fs.writeFileSync(dest, result);
  }
  writeTemplatesWithData (...templates) {
    var self = this;
    _.each(templates, function (template) {
      self.writeTemplateWithData(template);
    });
  }
  getSource (filePath) {
    var source = fs.readFileSync(filePath, 'utf8');
    return source;
  }
  compile (source) {
    return Handlebars.compile(source);
  }
  // For now, we'll just check three levels.
  findProjectDir () {
    try {
      var base = process.cwd();
      var firstLevel = path.join(base, '.ion');
      var secondBase = path.dirname(base);
      var secondLevel = path.join(secondBase, '.ion');
      var thirdBase = path.dirname(secondBase);
      var thirdLevel = path.join(thirdBase, '.ion');

      if (this.isDir(firstLevel)) {
        return base;
      } else if (this.isDir(secondLevel)) {
        return secondBase;
      } else if (this.isDir(thirdLevel)) {
        return thirdBase;
      } else {
        this.logError("No ion project found in the directory: ", process.cwd());
        return false;
      }
    } catch (e) {
      // XXX: Need to inform the user that
      // they are not in a project, and possibly
      // log a usage or helper error.
      this.logError("No ion project found in the directory: ", process.cwd());
      return false;
    }

  }
}

module.exports = FileSystem;