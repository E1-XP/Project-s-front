import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import styled from 'styled-components';

import { State } from '../../store/interfaces';

import CircularProgress from '@material-ui/core/CircularProgress';

interface Props {
  isLoading: boolean;
  isSocketConnected: boolean;
  children?: React.ReactChildren;
  fullHeight?: boolean;
}

interface PreloaderWrapperProps {
  fullHeight?: boolean;
}

const PreloaderWrapper = styled.div<PreloaderWrapperProps>`
  width: 100%;
  height: ${({ fullHeight }) => (fullHeight ? '100vh' : '100%')};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PreloaderComponent: any = ({
  isLoading = true,
  fullHeight = false,
  children,
}: Props) => {
  return isLoading ? (
    <PreloaderWrapper fullHeight={fullHeight}>
      <CircularProgress color="primary" />
    </PreloaderWrapper>
  ) : (
    children
  );
};

const mapStateToProps = ({ global }: State) => ({
  isLoading: global.isLoading,
});

export const Preloader = compose(connect(mapStateToProps))(props => (
  <PreloaderComponent {...props} fullHeight={true} />
));
