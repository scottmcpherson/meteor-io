var Command = require('../command');

class Init extends Command {
  constructor() {
    super();
    this.alias = 'i';
    this.name = 'init';
    this.description = 'io init';
  }
  run(args, argv) {
    let cwd = process.cwd();
    if (this.isDir(this.join(cwd, '.meteor'))) {
      console.log('');
      console.log('Please make a copy of your app before proceeding');
      console.log('');
      if (this.confirmWithUser('Are you ready to continue?')) {
        let appDir = this.join(cwd, 'app');
        this.mkdir(appDir);
        this.move(cwd, appDir);
        this.mkdirs(cwd, [cwd, 'config', 'development']);

        let adminTemplatesPath = this.join(this._adminTemplatesDir, 'templates');
        let ioDirPath = this.join(cwd, '.io');
        let ioFilePath = this.join(ioDirPath, 'config.json');
        let ioSrcPath = this.join(adminTemplatesPath, 'admin-config.json');

        this.mkdir(ioDirPath);
        this.copy(ioSrcPath, ioFilePath);
        this.copy([adminTemplatesPath, 'env.sh'],
                  [cwd, 'config', 'development', 'env.sh']);

        this.setupProjectConfig(cwd);
        this.logSuccessInstructions('initialized');
      }
    } else {
      console.log('No meteor project found');
    }
  }
}

module.exports = new Init;
