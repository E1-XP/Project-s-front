import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { withRouter } from "react-router-dom";
import { lifecycle, compose, ReactLifeCycleFunctions } from "recompose";

import { State } from "../../store";
import { actions } from "../../actions";

import CircularProgress from "@material-ui/core/CircularProgress";

interface Props {
  isLoading: boolean;
  children?: React.ReactChildren;
  initializeApp: () => Dispatch;
}

const hooks: ReactLifeCycleFunctions<Props, {}> = {
  componentDidMount() {
    this.props.initializeApp();
  }
};

const mapStateToprops = ({ global }: State) => ({
  isLoading: global.isLoading
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initializeApp: () => dispatch(actions.global.initApp())
});

export const PreloaderComponent: any = ({ isLoading, children }: Props) => {
  return isLoading ? (
    <div className="container--fullwidthcenter windowheight">
      <CircularProgress />
    </div>
  ) : (
    children
  );
};

export const Preloader = compose(
  withRouter,
  connect(
    mapStateToprops,
    mapDispatchToProps
  ),
  lifecycle(hooks)
)(PreloaderComponent);
