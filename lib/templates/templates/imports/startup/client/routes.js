import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import { AppLayout } from '../../ui/layouts/AppLayout';
import HomePage from '../../ui/pages/HomePage';

FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(AppLayout, {
      content: (<HomePage />)
    });
  }
});
