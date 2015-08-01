var Command = require('./command');
var requireDir = require('require-dir');
var generators = requireDir('./generators');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');


// console.log('gens', _.keys(generators));


var Ion = new Command({ name: 'Template',
                        generators: generators });



module.exports = Ion;