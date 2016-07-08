import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import AppLayout from '../../ui/layouts/AppLayout.jsx';
import HomePage from '../../ui/pages/HomePage.jsx';

FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(AppLayout, {
      content: (<HomePage />)
    });
  }
});
