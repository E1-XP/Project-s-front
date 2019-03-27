import * as React from 'react';
import { Formik, FormikProps } from 'formik';

import { Props, FormState } from './index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { MainContainer } from './../../styles';

interface InputProps {
  values: FormikProps<FormState>['values'];
  handleChange: FormikProps<FormState>['handleChange'];
  errors: FormikProps<FormState>['errors'];
}

interface PassedToForm {
  currentRoute: string;
  formMessage: string;
  setFormMessage: Props['setFormMessage'];
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

const Form = ({
  values,
  errors,
  isValid,
  handleChange: formikOwnHandleChange,
  handleSubmit,
  currentRoute,
  formMessage,
  setFormMessage,
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
        <Typography align="center" variant="caption" color="error">
          {formMessage ||
            [...new Set([errors.username, errors.email, errors.password])].join(
              ', ',
            )}
        </Typography>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </FormControl>
    </form>
  );
};

export const FormComponent = (props: Props) => {
  const {
    currentRoute,
    validateUser,
    handleSubmit,
    formMessage,
    setFormMessage,
  } = props;

  const formHeading =
    currentRoute === 'login'
      ? 'Login to enter Project-S'
      : 'Sign Up to enter Project-S';

  return (
    <MainContainer>
      <Grid container={true} spacing={16} justify="center">
        <Grid item={true} md={7} sm={9} xs={12}>
          <Paper>
            <Typography align="center" variant="h4" className="mbottom-2">
              {formHeading}
            </Typography>
            <Grid container={true} justify="center">
              <Grid item={true} md={6} sm={7} xs={10}>
                <Formik
                  initialValues={{ email: '', username: '', password: '' }}
                  validate={validateUser}
                  onSubmit={handleSubmit}
                  render={(props: FormikProps<FormState>) => (
                    <Form
                      {...props}
                      currentRoute={currentRoute}
                      formMessage={formMessage}
                      setFormMessage={setFormMessage}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </MainContainer>
  );
};
