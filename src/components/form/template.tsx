import * as React from 'react';
import { Formik, FormikProps } from 'formik';

import { Props, FormState } from './index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export const FormComponent = ({
  currentRoute,
  validateUser,
  handleSubmit,
}: Props) => {
  const formHeading =
    currentRoute === 'login'
      ? 'Login to enter Project-S'
      : 'Sign Up to enter Project-S';

  const UsernameField = ({
    values,
    handleChange,
    errors,
  }: FormikProps<FormState>) => (
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

  const EmailField = ({
    values,
    handleChange,
    errors,
  }: FormikProps<FormState>) => (
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

  const PasswordField = ({
    values,
    handleChange,
    errors,
  }: FormikProps<FormState>) => (
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

  const Form = (props: FormikProps<FormState>) => {
    const { errors, isValid, handleSubmit } = props;

    return (
      <form onSubmit={handleSubmit}>
        <FormControl margin="normal" fullWidth={true}>
          {currentRoute === 'signup' && <UsernameField {...props} />}
          <EmailField {...props} />
          <PasswordField {...props} />
          <Typography align="center" variant="subtitle1">
            {[...new Set(Object.values(errors))].join(' ')}
          </Typography>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </FormControl>
      </form>
    );
  };

  return (
    <main className="container">
      <Grid container={true} spacing={16} justify="center">
        <Grid item={true} md={7} sm={9} xs={12}>
          <Paper className="paper">
            <Typography align="center" variant="display1" className="mbottom-2">
              {formHeading}
            </Typography>
            <Grid container={true} justify="center">
              <Grid item={true} md={6} sm={7} xs={10}>
                <Formik
                  component={Form}
                  initialValues={{ email: '', username: '', password: '' }}
                  validate={validateUser}
                  onSubmit={handleSubmit}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
};
