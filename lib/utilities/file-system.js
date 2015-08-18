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


  // Need to wire these up
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
    return path.join(this.projectPath, 'config', 'development', 'env.js');
  }


  get adminCommandPath () {
    return path.join(this.adminRootDir, 'lib', 'command.js');
  }
  get adminRootDir () {
    return appDir.replace('/bin', '');
  }
  get adminConfigPath () {
    return path.join(this.adminRootDir, 'config', 'config.json');
  }
  get adminTemplatesDir () {
    return path.join(this.adminRootDir, 'lib', 'templates');
  }
  get adminCofig () {
    try {
      var json = fs.readJsonSync(this.adminConfigPath);
      return json;
    } catch (e) {
      this.logError(e);
      return false;
    }
  }
  get ionPath () {
    return this.adminCofig.ionPath;
  }
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
    fs.mkdirSync(dir);
  }
  mkdirs (...dirs) {
    var self = this;
    _.each(dirs, function (dir) {
      self.mkdir(dir);
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
  writeTemplate (template) {
    var dir = path.join(this.adminRootDir, template);
    var file = fs.readFileSync(dir);
    // TODO: Write file somewhere
  }
  writeTemplates (...templates) {
    _.each(templates, function (template) {
      this.writeTemplate(template);
    });
  }
  // XXX: Smarter defaults and checking needed.
  writeTemplateWithData (opts) {
    opts = opts || {};
    var template = opts.template || '';
    var source = this.getSource(template);
    var compiledTemplate = this.compile(source);
    var data = opts.data || {};
    var result = compiledTemplate(data);
    var destination = opts.destination || '';
    fs.writeFileSync(destination, result);
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