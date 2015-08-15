var _ = require('underscore');
var FileSystem = require('./utils/file-system');
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
  isIonConfigUserPath () {
    try {
      var ionFilePath = this.ionAdminConfigPath;
      if (! ionFilePath) return false;

      var isIonFile = this.isFile(ionFilePath);
      if (! isIonFile) return false;

      var isIonUserDir = this.isDir(this.ionAdminConfigUsersPath);
      return isIonUserDir;

    } catch (e) {
      console.log(e);
      return false;
    }
  }
  createMeteorApp (projectPath) {
    try {
      var results = exec('meteor create app', { cwd: projectPath });
      this.logSuccess(results);
    } catch (e) {
      this.logError(e);
    }
  }
  runMeteor () {
    var args = [];
    var settingsPath = this.settingsPath;
    var envPath = this.envPath;

    if (this.isFile(settingsPath)) {
      args.push('--settings', settingsPath);
    }
    // if (this.isFile(envPath)) {
    //   this.syncSource(envPath);
    // }

    // XXX: User env file
    var envVars = _.extend(process.env, {
      JASMINE_CLIENT_UNIT: "0"
    });



    var child = spawn('meteor', args, {
      cwd: this.projectAppPath,
      env: envVars
    });

    child.stdout.on('data', function stdout(data) {
      console.log(data.toString());
    });

    child.stderr.on('data', function stderr(data) {
      console.error(data.toString());
    });

    // _.each(['SIGINT', 'SIGHUP', 'SIGTERM'], function (sig) {
    //   process.once(sig, function () {
    //     process.kill(child.pid, sig);
    //     process.kill(process.pid, sig);
    //   });
    // });

    child.on('exit', function() {
      console.log("done");
    });

  }
};

module.exports =  Utils;