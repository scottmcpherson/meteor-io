const Command = require('../command');

class Route extends Command {
  constructor() {
    super();
    // A shorter name to call your generator with.
    this.alias = 'r';
    // This name should match the file name without the extension.
    this.name = 'route';
    // A brief description on how to use this.
    this.description = 'io g:{route, r} [path/]<name>';
  }
  run(args, argv) {
    if (args.length < 2) {
      throw new Error('Requires two args');
    }

    const fileBaseName = this.getBaseName(args[1]);
    const pageName = this.classify(fileBaseName) + 'Page';
    const camelName = this.camelize(fileBaseName);

    const importPath = this.join(this.config.dest, pageName);
    const importStatement = `import ${pageName} from '../../ui/pages/${pageName}'\n`;
    this.writeImportToFile(this.config.dest, importStatement);


    // Create the route
    this.writeTemplateWithDataToEndOfFile({
      src: 'route.js',
      dest: this.config.dest,
      data: { name: fileBaseName, pageName, camelName }
    });

    // Create page for this route
    this.runGenerator('page', args, argv);
  }
}

module.exports = new Route;
