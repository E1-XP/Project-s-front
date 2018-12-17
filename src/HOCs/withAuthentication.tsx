import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { lifecycle, compose, ReactLifeCycleFunctions } from 'recompose';
import { withRouter } from 'react-router-dom';
import { push } from 'connected-react-router';

import { State } from '../store';

interface Props {
  isUserLoggedIn: boolean;
  children?: React.ReactChildren;
  pushRouter: (s: string) => Dispatch;
}

const hooks: ReactLifeCycleFunctions<Props, {}> = {
  componentDidMount() {
    const { isUserLoggedIn, pushRouter } = this.props;

    if (!isUserLoggedIn) pushRouter('/login');
  },
};

const mapStateToProps = ({ global, router }: State) => ({
  isUserLoggedIn: global.isUserLoggedIn,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  pushRouter: (str: string) => dispatch(push(str)),
});

export const withAuthentication = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle(hooks),
);
