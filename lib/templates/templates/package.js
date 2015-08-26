Package.describe({
  name: '{{packageName}}',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('raisal-core');

  api.addFiles('lib/server/methods.es6', 'server');

  api.addFiles('lib/client/templates/temp-demo-signin.html', 'client');
  api.addFiles('lib/client/templates/temp-demo-signin.es6', 'client');
  api.addFiles('lib/client/stylesheets/temp-demo-signin.scss', 'client');
});

Package.onTest(function(api) {
});