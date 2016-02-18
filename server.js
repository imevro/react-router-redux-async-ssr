import qs from 'qs' // Add this at the top of the file
import { renderToString } from 'react-dom/server';

import path from 'path'
import Express from 'express'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const { MODULE } = process.env;
const reducers = require(`./src/${MODULE}/reducers`).default;
const App = require(`./src/${MODULE}/containers/App`).default;

const app = Express();
const port = 3000;

import fs from 'fs';
app.use('/bundle.js', function (req, res) {
  return fs.createReadStream(`./build/${MODULE}/index.js`).pipe(res);
});
app.use(handleRender);

// We are going to fill these out in the sections to follow
function handleRender(req, res) {
  // Read the counter from the request, if provided
  const params = qs.parse(req.query)
  const counter = parseInt(params.counter, 10) || 0

  // Compile an initial state
  let initialState = { counter }

  // Create a new Redux store instance
  const store = createStore(reducers, initialState)

  // Render the component to a string
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )

  // Grab the initial state from our Redux store
  const finalState = store.getState()
  const page = renderFullPage(html, finalState);

  // Send the rendered page back to the client
  res.send(page)
}

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
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
