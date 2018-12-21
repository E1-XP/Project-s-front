import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  compose,
  withHandlers,
  lifecycle,
  ReactLifeCycleFunctions,
} from 'recompose';
import { ErrorMessageProps } from 'formik';

import { State } from '../../store';
import { actions } from '../../actions';

import { FormComponent } from './template';

import { withUserValidation } from '../../HOCs/withUserValidation';

export interface FormState {
  username: string;
  email: string;
  password: string;
}

export interface Props {
  formState: FormState;
  currentRoute: string;
  handleSubmit: (formState: FormState, actions: any) => void;
  initAuthentication: (data: FormState) => Dispatch;
  pushRouter: (str: string) => Dispatch;
  isUserLoggedIn: () => Dispatch;
  validateUser: (v: FormState) => ErrorMessageProps;
}

const lifecycleMethods: ReactLifeCycleFunctions<Props, {}> = {
  componentDidMount() {
    const { isUserLoggedIn, pushRouter } = this.props;

    isUserLoggedIn && pushRouter('/dashboard');
  },
};

const handlers = {
  handleSubmit: (props: Props) => (values: FormState, actions: any) => {
    console.log('values', values);
    props.initAuthentication(values);
  },
};

const mapStateToProps = ({ global }: State) => ({
  isUserLoggedIn: global.isUserLoggedIn,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initAuthentication: (data: FormState) =>
    dispatch(actions.global.initAuthentication(data)),
  pushRouter: (str: string) => dispatch(push(str)),
});

export const Form = compose<Props, {}>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withUserValidation,
  withHandlers(handlers),
  lifecycle<Props, {}>(lifecycleMethods),
)(FormComponent);
