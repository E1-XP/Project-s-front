import * as React from 'react';
import { compose, lifecycle, ReactLifeCycleFunctions } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { setHasErrored } from './../../actions/global';
import { State } from './../../store/interfaces';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

import { Heading } from './../shared/heading';
import { MainContainer } from './../../styles';

interface Props {
  hasErrored: boolean;
  setHasErrored: (v: boolean) => Dispatch;
}

const BigIcon = styled(Icon)`
  font-size: 20rem !important;
  margin-top: 4rem;
  margin-bottom: 4rem;
`;

const mSTP = ({ global: { hasErrored } }: State) => ({ hasErrored });

const hooks: ReactLifeCycleFunctions<Props, {}> = {
  componentWillUnmount() {
    const { hasErrored, setHasErrored } = this.props;
    hasErrored && setHasErrored(false);
  },
};

export const ErrorPage = compose<Props, {}>(
  connect(
    mSTP,
    { setHasErrored },
  ),
  lifecycle(hooks),
)(({ hasErrored }: Props) =>
  !hasErrored ? (
    <Redirect to="/" />
  ) : (
    <MainContainer>
      <Grid container={true} spacing={16}>
        <Grid item={true} xs={12}>
          <Paper>
            <Heading icon="remove_circle" text="Error page" justify="center" />
            <Grid container={true} justify="center">
              <BigIcon>error_outline</BigIcon>
            </Grid>
            <Grid container={true} justify="center">
              <Typography align="center" variant="h6">
                Application crashed. Please try again in a few minutes.
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </MainContainer>
  ),
);
