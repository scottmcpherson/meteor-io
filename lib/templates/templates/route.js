FlowRouter.route('/{{name}}', {
  name: '{{camelName}}',
  action() {
    mount(Layout, {
      content: (<{{camelName}} />)
    });
  }
});
