FlowRouter.route('/blog/:postId', {
  action: function(params, queryParams) {
    console.log("Params:", params);
    console.log("Query Params:", queryParams);
  },
  name: "{{name}}"
});