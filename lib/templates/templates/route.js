FlowRouter.route('/{{name}}', {
  name: '{{camelName}}',
  action: function() {
    BlazeLayout.render('masterLayout', { content: '{{camelName}}' });
  },
});
