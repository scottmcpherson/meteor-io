var fs = require('fs-extra');
var path = require('path');
var _  = require('underscore');
var Handlebars = require('handlebars');
var appDir = path.dirname(require.main.filename);
var Logger  = require('./logger');

class FileSystem extends Logger {
  // For the user.
  get templatesPath () {
    var templatesPath = path.join(this.ionAdminConfigUsersPath, 'templates');
    return templatesPath;
  }


  // Need to wire these up
  get projectPath () {
    return this.findProjectDir();
  }
  get projectAppPath () {
    return path.join(this.projectPath, 'app');
  }
  get projectPackagesPath () {
    return process.cwd();
  }
  get settingsPath () {
    return path.join(this.projectPath, 'config', 'development', 'settings.json');
  }
  get envPath () {
    return path.join(this.projectPath, 'config', 'development', 'env.js');
  }


  get commandPath () {
    return path.join(this.adminRootDir, 'lib', 'command.js');
  }
  get adminRootDir () {
    return appDir.replace('/bin', '');
  }
  get ionAdminConfigPath () {
    return path.join(this.adminRootDir, 'config', 'config.json');
  }
  get adminTemplatesDir () {
    return path.join(this.adminRootDir, 'lib', 'templates');
  }
  get ionAdminConfig () {
    try {
      var json = fs.readJsonSync(this.ionAdminConfigPath);
      return json;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  get ionAdminConfigUsersPath () {
    return this.ionAdminConfig.usersIonPath;
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
  mkdir (dirPath) {
    fs.mkdirSync(dirPath);
  }
  mkdirs (...dirPaths) {
    var self = this;
    _.each(dirPaths, function (dirPath) {
      self.mkdir(dirPath);
    });
  }
  remove (dir) {
    fs.removeSync(dir);
  }
  removeAll (...dirs) {
    var self = this;
    _.each(dirs, function (dir) {
      self.remove(dir);
    });
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
    console.log("CALLED");
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
        console.log("Second Called");
        return secondBase;
      } else if (this.isDir(thirdLevel)) {
        return thirdBase;
      } else {
        return false;
      }
    } catch (e) {
      // XXX: Need to inform the user that
      // they are not in a project, and possibly
      // log a usage or helper error.
      console.log("Not in project");
      return false;
    }

  }
}

module.exports = FileSystem;