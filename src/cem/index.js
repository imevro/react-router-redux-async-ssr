import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router';

// middlewares
import thunk from 'redux-thunk';

// local
import routes from 'cem/routes';
import reducers from 'cem/reducers'

import 'cem/styles/base';

// Grab the state from a global injected into server-generated HTML
const initialState = window.__INITIAL_STATE__

// Create Redux store with initial state
const store = createStore(
  combineReducers(reducers),
  initialState,
  applyMiddleware(thunk)
);

render(
  <Provider store={store}>
    <Router children={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('app')
)
