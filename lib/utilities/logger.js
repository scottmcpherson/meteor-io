var _ = require('underscore');
var cli = require('cli-color');
var Table = require('cli-table');

class Logger {
  logSuccess(...args) {
    console.log(cli.green.apply(this, args));
  }
  logWarning(...args) {
    console.log(cli.yellow.apply(this, args));
  }
  logError(...args) {
    console.log(cli.red.apply(this, args));
  }
  logComplete(...args) {
    console.log(cli.green.apply(this, args));
  }
  logNoProjectFound(commands, generator) {
    console.log();
    this.logError('No io project found in the directory: ', process.cwd());
    console.log();
    this.logSuccess('To create one, run the command:');
    this.logSuccess('$ io create <project-name>');
    console.log();
  }
  logHelp(commands, generators) {
    var commandTable = borderlessTable('Command:', 'Description');

    _.each(commands, function(command) {
      let name = command.name || '';
      let description = command.description || '';
      commandTable.push([
        name, description
      ]);
    });

    console.log();
    console.log('Commands');
    console.log(commandTable.toString());
    console.log();

    var generatorTable = borderlessTable('Generator:', 'Description');
    _.each(generators, function(gen) {
      let name = gen.name || '';
      let description = gen.description || '';
      generatorTable.push([
        name, description
      ]);
    });

    console.log('Generators');
    console.log(generatorTable.toString());
    console.log();

  }
}

function borderlessTable(...head) {
  return new Table({
    head: head,
    chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
           , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
           , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
           , 'right': '' , 'right-mid': '' , 'middle': ' ' },
    style: { 'padding-left': 0, 'padding-right': 5 },
  });
}

module.exports = Logger;
