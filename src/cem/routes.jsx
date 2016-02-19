import React from 'react';
import { Route, Redirect } from 'react-router';
import * as Containers from 'cem/containers';

export default (
  <Route>
    <Route component={Containers.Root}>
      <Route path="/" component={Containers.App} />

      <Redirect from="/properties" to="/properties/sale" />
      <Route path="/properties/:kind" component={Containers.Properties.List} />
    </Route>
  </Route>
)
