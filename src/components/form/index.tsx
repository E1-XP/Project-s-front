import * as React from 'react';
import { FormikProps } from 'formik';
import { Dispatch } from 'redux';

import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import { GradientButton } from './../../styles';

export interface FormState {
  username: string;
  email: string;
  password: string;
}

interface InputProps {
  values: FormikProps<FormState>['values'];
  handleChange: FormikProps<FormState>['handleChange'];
  setFieldTouched: FormikProps<FormState>['setFieldTouched'];
  errors: FormikProps<FormState>['errors'];
  touched: FormikProps<FormState>['touched'];
}

interface PassedToForm {
  currentRoute: string;
  formMessage: string;
  setFormMessage: (v: string) => Dispatch;
  isFetching: boolean;
}

const UsernameField = ({
  values,
  handleChange,
  errors,
  touched,
  setFieldTouched,
}: InputProps) => (
  <TextField
    error={touched.username && !!errors.username}
    required={true}
    id="username"
    placeholder="username"
    label="Username"
    margin="dense"
    variant="outlined"
    value={values.username}
    onBlur={() => setFieldTouched('username')}
    onChange={handleChange}
  />
);

const EmailField = ({
  values,
  handleChange,
  errors,
  touched,
  setFieldTouched,
}: InputProps) => (
  <TextField
    error={touched.email && !!errors.email}
    required={true}
    id="email"
    placeholder="email"
    label="Email"
    margin="dense"
    variant="outlined"
    value={values.email}
    onBlur={() => setFieldTouched('email')}
    onChange={handleChange}
  />
);

const PasswordField = ({
  values,
  handleChange,
  errors,
  touched,
  setFieldTouched,
}: InputProps) => (
  <TextField
    error={touched.password && !!errors.password}
    required={true}
    id="password"
    placeholder="password"
    label="Password"
    type="password"
    margin="dense"
    variant="outlined"
    value={values.password}
    onBlur={() => setFieldTouched('password')}
    onChange={handleChange}
  />
);

const minHeight = { minHeight: '21px' };

export const Form = ({
  values,
  errors,
  touched,
  isValid,
  setFieldTouched,
  handleChange: formikOwnHandleChange,
  handleSubmit,
  currentRoute,
  formMessage,
  setFormMessage,
  isFetching,
}: FormikProps<FormState> & PassedToForm) => {
  const handleChange = (e: any) => {
    if (e.target.id === 'email' && formMessage) setFormMessage('');
    formikOwnHandleChange(e);
  };
  const inputProps = { values, errors, touched, handleChange, setFieldTouched };

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
          {[
            ...new Set(
              [
                formMessage,
                (!!values.username || touched.username) && errors.username,
                (!!values.email || touched.email) && errors.email,
                (!!values.password || touched.password) && errors.password,
              ].filter(Boolean),
            ),
          ].join(', ')}
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
