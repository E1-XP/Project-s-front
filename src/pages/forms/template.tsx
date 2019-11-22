import * as React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { Form } from '../../components/form';

import { Heading } from '../../components/shared/heading';
import { MainContainer } from './../../styles';

import { Props } from './';

export const FormComponent = (props: Props) => {
  const { currentRoute } = props;

  const formDescription =
    currentRoute === 'login'
      ? 'Log in to enter Project-S'
      : 'Sign up to enter Project-S';
  const FormHeading = currentRoute === 'login' ? 'Login Form' : 'Register Form';

  return (
    <MainContainer>
      <Grid container={true} spacing={16} justify="center">
        <Grid item={true} md={7} sm={9} xs={12}>
          <Paper>
            <Heading icon="exit_to_app" text={FormHeading} justify="center" />
            <Grid container={true} justify="center">
              <Typography align="center" variant="h6">
                {formDescription}
              </Typography>
            </Grid>
            <Grid container={true} justify="center">
              <Grid item={true} md={6} sm={7} xs={10}>
                <Form {...props} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </MainContainer>
  );
};
