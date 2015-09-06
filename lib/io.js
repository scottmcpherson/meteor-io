var Command = require('./command');
var requireDir = require('require-dir');
var commands = requireDir('./commands');
var Ion = new Command({ name: 'Template',
                        commands: commands });

module.exports = Ion;
