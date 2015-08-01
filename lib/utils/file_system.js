var fs = require('fs');
var path = require('path');
var _  = require('underscore');
var Handlebars = require('handlebars');
var appDir = path.dirname(require.main.filename);

class FileSystem {
  getRoot () {
    return appDir.replace('/bin', '');
  }
  writeFile (file) {
    var dir = path.join(this.getRoot(), file);
    var file = fs.readFileSync(dir);
    // TODO: Write file somewhere
  }
  writeFiles (...files) {
    _.each(files, function (file) {
      this.writeFile(file);
    });
  }
  writeFileWithData (file, data) {
    var source = this.getSource(file);
    var template = this.compile(source);
    var result = template(data);
    var filePath = path.join(this.getRoot(), 'temp', file);
    fs.writeFileSync(filePath, result);
  }
  writeFilesWithData (...files) {
    _.each(files, function (file) {
      this.writeFileWithData(file.name, file.data);
    });
  }
  getSource (file) {
    var dir = path.join(this.getRoot(), 'lib/templates', file);
    var source = fs.readFileSync(dir, 'utf8');
    return source;
  }
  compile (source) {
    return Handlebars.compile(source)
  }
}

module.exports = FileSystem;