import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { withAuthentication } from "./HOCs/withAuthentication";

import { Preloader } from "./components/preloader";
import { Navbar } from "./components/navbar";
import { Form } from "./components/form";
import { Dashboard } from "./components/dashboard";
import { RoomCreate } from "./components/roomcreate";
import { Room } from "./components/room";
import { NotFound } from "./components/404";

export const routes = (<Preloader>
    <Route path="/signup" component={Form} />
    <Route path="/login" component={Form} />
    <Navbar />
    <Switch>
        <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
        <Route path="/dashboard" component={withAuthentication(Dashboard)} />
        <Route path="/room/create" component={withAuthentication(RoomCreate)} />
        <Route path="/room/:id" component={withAuthentication(Room)} />
        {/* <Route component={NotFound} /> */}
    </Switch>
</Preloader>);
