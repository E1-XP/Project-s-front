import * as React from 'react';
const { Suspense, lazy } = React;
import { Route, Switch, Redirect } from 'react-router-dom';

import { Preloader, PreloaderFallback } from './../components/preloader';
import { Navbar } from './../components/navbar';

import { Form } from './../pages/forms';
import { NotFound } from '../pages/404';
import { ErrorPage } from '../pages/500';

const Dashboard = lazy(() => import('../pages/dashboard'));
const Inbox = lazy(() => import('../pages/inbox'));
const Gallery = lazy(() => import('../pages/gallery'));
const RoomCreate = lazy(() => import('../pages/roomcreate'));
const RoomPasswordScreen = lazy(() => import('../pages/room/enterpassword'));
const Room = lazy(() => import('../pages/room'));

export const routes = (
  <Preloader>
    <Suspense fallback={<PreloaderFallback />}>
      <Navbar />
      <Switch>
        <Route
          exact={true}
          path="/"
          render={() => <Redirect to="/dashboard" />}
        />
        <Route path="/signup" component={Form} />
        <Route path="/login" component={Form} />

        <Route path="/dashboard" component={Dashboard} />
        <Route path="/inbox" component={Inbox} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/room/create" component={RoomCreate} />
        <Route path="/room/:id/password" component={RoomPasswordScreen} />
        <Route path="/room/:id" component={Room} />
        <Route path="/500" component={ErrorPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  </Preloader>
);
