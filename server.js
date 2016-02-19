import fs from 'fs';
import qs from 'qs' // Add this at the top of the file
import path from 'path'
import Express from 'express'

import React from 'react'
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux'
import { Provider } from 'react-redux'

// router
import { match, RouterContext } from 'react-router'

// hook for css modules
require(`css-modules-require-hook`)({
  generateScopedName: '[name]__[local]___[hash:base64:5]'
});

// required because of MODULE
const { MODULE } = process.env;
const routes = require(`./src/${MODULE}/routes`).default;
const reducers = require(`./src/${MODULE}/reducers`).default;

// express app
const app = Express();
const port = 3000;

// static bundle.js and bundle.css
app.use('/bundle.js', function (req, res) {
  return fs.createReadStream(`./build/${MODULE}/index.js`).pipe(res);
});

app.use('/bundle.css', function (req, res) {
  return fs.createReadStream(`./build/${MODULE}/index.css`).pipe(res);
});

// react-render
app.use(handleRender);

function handleRender(req, res) {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      ////// Redux
      // Compile an initial state
      // Read the counter from the request, if provided
      const params = qs.parse(req.query);
      const counter = parseInt(params.counter, 10) || 0;
      const initialState = { counter };

      // Create a new Redux store instance
      const store = createStore(reducers, initialState)

      // Render the component to a string
      const html = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )

      // Grab the initial state from our Redux store
      const finalState = store.getState();
      const page = renderFullPage(html, finalState);

      // Send the rendered page back to the client
      res.status(200).send(page);
    } else {
      res.status(404).send('Not found')
    }
  })
}

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>react-redux-react-router-ssr</title>
        <link rel="stylesheet" href="/bundle.css" />
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `
}

app.listen(port, `localhost`, () => {
  console.log(`started at http://localhost:${port}`);
});
