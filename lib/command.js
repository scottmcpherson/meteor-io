var _ = require('underscore');
var Utils = require('./utils');
var path = require('path');
var fs = require('fs');

class Command extends Utils {
  constructor(opts) {
    super();
    opts = opts || {};
    this.name = opts.name;
    this.generators = opts.generators || [];
    console.log("This Name: ", this.name);
  }
  get generatorKeys () {
    return _.keys(this.generators);
  }
  run(args, argv) {
    // This will be the master run
    // that is always the first to run
    // After that, we need to find and
    // run another generator if specified
    // console.log("Got args: ", args);
    // console.log("Got argv: ", argv);


    // TODO: Need to handle no args
    var command = args[0];
    var generator = this.findGenerator(command);

    console.log("generators: ", this.generators);
    console.log(this.generators[generator]);
    this.generators[generator].run();

    // this.writeFileWithData();
  }
  findGenerator (command) {
    var splitCommand = command.split(':');
    if (splitCommand.length > 1 &&
        _.contains(this.generatorKeys, splitCommand[1]))
    {
      return splitCommand[1];
    }
    throw new Error("Can't find generator");
  }
};

module.exports = Command;

