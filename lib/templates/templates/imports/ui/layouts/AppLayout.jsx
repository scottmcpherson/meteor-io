import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

export const AppLayout = ({content}) => (
  <div>
    <header>
      This is our header
    </header>
    <main>
      {content}
    </main>
  </div>
);
