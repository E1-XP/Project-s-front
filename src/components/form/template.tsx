import * as React from 'react';
import { FormikProps } from 'formik';

import { Props, FormState } from './index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import { MainContainer, GradientButton, HeadlineIcon } from './../../styles';

interface InputProps {
  values: FormikProps<FormState>['values'];
  handleChange: FormikProps<FormState>['handleChange'];
  errors: FormikProps<FormState>['errors'];
}

interface PassedToForm {
  currentRoute: string;
  formMessage: string;
  setFormMessage: Props['setFormMessage'];
  isFetching: boolean;
}

const UsernameField = ({ values, handleChange, errors }: InputProps) => (
  <TextField
    error={!!errors.username}
    required={true}
    id="username"
    placeholder="username"
    label="Username"
    margin="dense"
    variant="outlined"
    value={values.username}
    onChange={handleChange}
  />
);

const EmailField = ({ values, handleChange, errors }: InputProps) => (
  <TextField
    error={!!errors.email}
    required={true}
    id="email"
    placeholder="email"
    label="Email"
    margin="dense"
    variant="outlined"
    value={values.email}
    onChange={handleChange}
  />
);

const PasswordField = ({ values, handleChange, errors }: InputProps) => (
  <TextField
    error={!!errors.password}
    required={true}
    id="password"
    placeholder="password"
    label="Password"
    type="password"
    margin="dense"
    variant="outlined"
    value={values.password}
    onChange={handleChange}
  />
);

const minHeight = { minHeight: '21px' };

const Form = ({
  values,
  errors,
  isValid,
  handleChange: formikOwnHandleChange,
  handleSubmit,
  currentRoute,
  formMessage,
  setFormMessage,
  isFetching,
}: FormikProps<FormState> & PassedToForm) => {
  const handleChange = (e: any) => {
    if (formMessage) setFormMessage('');
    formikOwnHandleChange(e);
  };
  const inputProps = { values, errors, handleChange };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl margin="normal" fullWidth={true}>
        {currentRoute === 'signup' && <UsernameField {...inputProps} />}
        <EmailField {...inputProps} />
        <PasswordField {...inputProps} />
        <Typography
          align="center"
          variant="subtitle2"
          color="error"
          style={minHeight}
        >
          {formMessage ||
            [...new Set([errors.username, errors.email, errors.password])].join(
              ', ',
            )}
        </Typography>
        <GradientButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={isFetching}
        >
          {isFetching ? <CircularProgress size={24} /> : 'Submit'}
        </GradientButton>
      </FormControl>
    </form>
  );
};

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
            <Grid container={true} justify="center">
              <HeadlineIcon>exit_to_app</HeadlineIcon>
              <Typography align="center" variant="h4">
                {FormHeading}
              </Typography>
            </Grid>
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
