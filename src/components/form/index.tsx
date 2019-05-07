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

import { State } from '../../store/interfaces';
import { actions } from '../../actions';

import { FormComponent } from './template';

import { withUserValidation } from '../../HOCs/withUserValidation';

export interface FormState {
  username: string;
  email: string;
  password: string;
}

export interface Props {
  isUserLoggedIn: boolean;
  isFetching: boolean;
  formState: FormState;
  currentRoute: string;
  formMessage: string;
  setFormMessage: (v: string) => Dispatch;
  handleSubmit: (formState: FormState, actions: any) => void;
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
    }
  },
  componentWillUnmount() {
    if (this.props.formMessage) {
      this.props.setFormMessage('');
    }
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withUserValidation,
  withHandlers(handlers),
  lifecycle(hooks),
)(FormComponent);
