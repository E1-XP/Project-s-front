import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import debounce from 'lodash/debounce';

import { actions } from './../actions';
import { State } from '../store/interfaces';
import { FormikErrors } from 'formik';

export interface RequestBody {
  email: string;
  username?: string;
  password: string;
}

interface Props {
  currentRoute: string;
  setFormMessage: (v: string) => Dispatch;
  initEmailCheck: (v: string) => Dispatch;
}

export interface IValidationMethods {
  validateUsername: (v: RequestBody) => boolean;
  validateEmail: (v: RequestBody) => boolean;
  validatePassword: (v: RequestBody) => boolean;
}

const regExp = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  username: /^([a-zA-Z0-9_-]){2,32}$/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
};

const handlers = () => {
  let emailCache: string;

  return {
    validateUser: (props: Props) => (values: RequestBody) => {
      const errors: FormikErrors<RequestBody> = {};

      const emptyFieldsErr = `all fields must be filled`;
      const usernameErr = `username must be between 2 and 32 alphanumeric, '_' or '-' characters long`;
      const emailErr = 'email adress is not valid';
      const passwordErr =
        'password must contain at least 8 characters, one upper and lowercase letter and one number';

      if (props.currentRoute !== 'signup') return errors;

      if (!values.email) {
        errors.email = emptyFieldsErr;
      } else if (!regExp.email.test(values.email)) {
        errors.email = emailErr;
        emailCache = values.email;
      } else if (
        props.currentRoute === 'signup' &&
        emailCache !== values.email
      ) {
        props.initEmailCheck(values.email);
        emailCache = values.email;
      }

      if (!values.username) {
        errors.username = emptyFieldsErr;
      } else if (!regExp.username.test(values.username)) {
        errors.username = usernameErr;
      }

      if (!values.password) {
        errors.password = emptyFieldsErr;
      } else if (!regExp.password.test(values.password)) {
        errors.password = passwordErr;
      }

      return errors;
    },
  };
};

const mapStateToProps = ({ router }: State) => ({
  currentRoute: router.location.pathname.toLowerCase().slice(1),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initEmailCheck: debounce(
    (v: string) => dispatch(actions.global.initEmailCheck(v)),
    500,
  ),
  setFormMessage: (v: string) => dispatch(actions.global.setFormMessage(v)),
});

export const withUserValidation = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(handlers),
);
