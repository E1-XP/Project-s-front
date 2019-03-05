import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { withAuthentication } from './../HOCs/withAuthentication';

import { Preloader } from './../components/shared/preloader';
import { Navbar } from './../components/navbar';
import { Form } from './../components/form';
import { Dashboard } from './../components/dashboard';
import { Inbox } from './../components/inbox';
import { RoomCreate } from './../components/roomcreate';
import { RoomPasswordScreen } from './../components/room/enterpassword';
import { Room } from './../components/room';
import { NotFound } from './../components/404';
import { ErrorPage } from './../components/500';

export const routes = (
  <Preloader>
    <Navbar />
    <Switch>
      <Route
        exact={true}
        path="/"
        render={() => <Redirect to="/dashboard" />}
      />
      <Route path="/signup" component={Form} />
      <Route path="/login" component={Form} />
      <Route path="/dashboard" component={withAuthentication(Dashboard)} />
      <Route path="/inbox" component={withAuthentication(Inbox)} />
      <Route path="/room/create" component={withAuthentication(RoomCreate)} />
      <Route
        path="/room/:id/password"
        component={withAuthentication(RoomPasswordScreen)}
      />
      <Route path="/room/:id" component={withAuthentication(Room)} />
      <Route path="/500" component={ErrorPage} />
      <Route component={NotFound} />
    </Switch>
  </Preloader>
);