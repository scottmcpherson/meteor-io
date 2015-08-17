var _ = require('underscore');
var cli = require('cli-color');
// var log = require('single-line-log').stdout;


class Logger {
  logSuccess (...args) {
    console.log(cli.green.apply(this, args));
  }
  logWarning (...args) {
    console.log(cli.yellow.apply(this, args));
  }
  logError (...args) {
    console.log(cli.red.apply(this, args));
  }
  logComplete (...args) {
    console.log(cli.green.apply(this, args));
  }
}

module.exports = Logger;