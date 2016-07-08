import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

const App = (props) => (
  <div>
    <header>
      This is our header
    </header>
    <main>
      {props.main}
    </main>
  </div>
);

export default AppLayout = createContainer(props => {
  // Props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  return {
    // user: Meteor.user(),
  };
}, App);
