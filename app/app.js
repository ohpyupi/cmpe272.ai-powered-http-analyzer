/* eslint no-undef: "off" */
if (process.env.NODE_ENV !== 'production') {
  /* eslint no-console: "off" */
  console.log('Looks like we are in development mode!');
}
/* eslint import/first: "off" */
import './styles.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import { Home } from './containers/home';
import { SampleContainer } from './containers/sample';
import { apolloClient } from './apollo-client';

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Router>
      <Switch>
        <Route path="/sample">
          <SampleContainer />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById('app'),
);