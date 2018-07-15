import React from "react";
import { connect, Dispatch } from 'react-redux';
import { withRouter } from "react-router-dom";
import { lifecycle, compose } from 'recompose';

import { State } from '../store';
import { actions } from '../actions'

type Props = {
    isLoading: boolean;
    children?: React.ReactChildren;
}

const lifecycleMethods = {
    componentDidMount() {
        this.props.initializeApp();
    }
}

const mapStateToprops = ({ global }: State) => ({
    isLoading: global.isLoading
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    initializeApp: () => dispatch(actions.global.initApp())
});

export const PreloaderComponent: any = ({ isLoading, children }: Props) => {
    return isLoading ? <p>Loading...</p> : (children);
};

export const Preloader = compose(
    withRouter,
    connect(mapStateToprops, mapDispatchToProps),
    lifecycle<Props, {}>(lifecycleMethods)
)(PreloaderComponent);
