import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class {{shortName}} extends Component {
  render() {
    return (
      <div>
        <h1>{{shortName}}</h1>
      </div>
    )
  }
}

{{shortName}}.propTypes = {};

export default {{longName}} = createContainer(props => {
  // Props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it

  // const handle = Meteor.subscribe();

  return {
    // user: Meteor.user(),
    // isLoading: ! handle.ready(),
  };
}, {{shortName}});
