import * as React from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { compose, lifecycle, ReactLifeCycleFunctions } from 'recompose';
import {
  withFormik,
  WithFormikConfig,
  FormikProps,
  ErrorMessageProps,
} from 'formik';

import { State } from '../../store/interfaces';
import { actions } from '../../actions';

import { FormComponent } from './template';
import { FormState } from './../../components/form';

import { withUserValidation } from '../../HOCs/withUserValidation';

export interface Props extends FormikProps<FormState> {
  isUserLoggedIn: boolean;
  isFetching: boolean;
  formState: FormState;
  currentRoute: string;
  formMessage: string;
  setFormMessage: (v: string) => Dispatch;
  initAuthentication: (data: FormState) => Dispatch;
  pushRouter: (str: string) => Dispatch;
  validateUser: (v: FormState) => ErrorMessageProps;
}

const hooks: ReactLifeCycleFunctions<Props, {}> = {
  componentDidMount() {
    const { isUserLoggedIn, pushRouter } = this.props;
    isUserLoggedIn && pushRouter('/dashboard');
  },
  componentDidUpdate(prevP, prevS) {
    if (prevP.currentRoute !== this.props.currentRoute) {
      this.props.setFormMessage('');
      this.props.handleReset();
    }
  },
  componentWillUnmount() {
    if (this.props.formMessage) {
      this.props.setFormMessage('');
    }
  },
};

const formikConfig: WithFormikConfig<Props, FormState> = {
  mapPropsToValues: props => ({ email: '', username: '', password: '' }),
  validate: (values, props) => props.validateUser(values),
  handleSubmit: (values, { props }) => {
    const trimmedValues = Object.entries(values).reduce((acc, [key, val]) => {
      acc[key as keyof typeof values] = val.trim();
      return acc;
    }, {} as typeof values);

    props.initAuthentication(trimmedValues);
  },
};

const mapStateToProps = ({ global }: State) => ({
  isUserLoggedIn: global.isUserLoggedIn,
  formMessage: global.formMessage,
  isFetching: global.isFetching,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initAuthentication: (data: FormState) =>
    dispatch(actions.global.initAuthentication(data)),
  setFormMessage: (v: string) => dispatch(actions.global.setFormMessage(v)),
  pushRouter: (str: string) => dispatch(push(str)),
});

export const Form = compose<Props, {}>(
  connect(mapStateToProps, mapDispatchToProps),
  withUserValidation,
  withFormik(formikConfig),
  lifecycle(hooks),
)(FormComponent);
