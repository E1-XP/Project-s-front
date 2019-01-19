import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { State } from '../../store';

import CircularProgress from '@material-ui/core/CircularProgress';

interface Props {
  isLoading: boolean;
  isSocketConnected: boolean;
  children?: React.ReactChildren;
}

const mapStateToProps = ({ global }: State) => ({
  isLoading: global.isLoading,
});

export const PreloaderComponent: any = ({
  isLoading = true,
  children,
}: Props) => {
  return isLoading ? (
    <div className="container--fullwidthcenter windowheight">
      <CircularProgress />
    </div>
  ) : (
    children
  );
};

export const Preloader = compose(connect(mapStateToProps))(PreloaderComponent);
