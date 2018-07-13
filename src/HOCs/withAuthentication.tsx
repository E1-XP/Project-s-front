import React from "react";
import { connect, Dispatch } from "react-redux";
import { lifecycle, compose } from "recompose";
import { withRouter } from "react-router-dom";
import { push } from "connected-react-router";

import { State } from '../store';

type Props = {
    isUserLoggedIn: boolean;
    children?: React.ReactChildren;
    pushRouter: (s: string) => Dispatch;
};

const lifecycleMethods = {
    componentDidMount() {
        const { isUserLoggedIn, pushRouter } = this.props;

        if (!isUserLoggedIn) pushRouter("/login");
    }
};

const mapStateToProps = ({ global, router }: State) => ({
    isUserLoggedIn: global.isUserLoggedIn,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    pushRouter: (str: string) => dispatch(push(str))
});

export const withAuthentication = compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle<Props, {}>(lifecycleMethods),
);
