const Command = require('../command');

class RaisalPackage extends Command {
  constructor() {
    super();
    // A shorter name to call your generator with.
    this.alias = 'p';
    // This name should match the file name without the extension.
    this.name = 'package';
    // A brief description on how to use this.
    this.description = 'io g:package <name>, io g:p <name>';
  }

  run(args, argv) {
    // Generator code here
    if (args.length < 2) {
      throw new Error('Specify a package name.');
      return process.exit(1);
    }

    var self = this;
    var packageName = args[1];
    var fileBaseName = self.getBaseName(args[1]);
    var cammelCasePackageName = self.camelize(packageName);
    var packagesPath = self.packagesPath;
    var libPath = self.join(packagesPath, packageName, 'lib');
    var readme = self.join(packagesPath, packageName, 'README.md');

    var jsFileName = packageName + '.js';
    var htmlFileName = packageName + '.html';

    var jsDest = self.join(libPath, 'client', 'templates', jsFileName);
    var htmlDest = self.join(libPath, 'client', 'templates', htmlFileName);

    self.mkdirs([libPath, 'client', 'templates'],
                [libPath, 'client', 'stylesheets'],
                [libPath, 'server']);

    console.log();

    var packageData = {
      packageName: packageName,
      jsDest: jsFileName,
      htmlDest: htmlFileName,
      meteorVersion: self.getMeteorVersion()
    };

    self.writeTemplatesWithData({
      src: [self.ioTemplatesPath, 'package.js'],
      dest: [packagesPath, packageName, 'package.js'],
      data: packageData,
    }, {
      src: [self.ioTemplatesPath, 'template.html'],
      dest: htmlDest,
      data: { name: cammelCasePackageName },
    }, {
      src: [self.ioTemplatesPath, 'template.js'],
      dest: jsDest,
      data: { name: cammelCasePackageName },
    });

    self.writeFile(readme);

    console.log();
  }
}

module.exports = new RaisalPackage;
