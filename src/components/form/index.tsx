import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  compose,
  withState,
  withHandlers,
  lifecycle,
  ReactLifeCycleFunctions,
} from 'recompose';

import { State } from '../../store';
import { actions } from '../../actions';

import { FormComponent } from './template';

interface FormState {
  username: string;
  email: string;
  password: string;
}

export interface Props {
  formState: FormState;
  location: any;
  setFormState: (obj: any) => void;
  setUsername: (props: any) => void;
  setEmail: (props: any) => void;
  setPassword: (props: any) => void;
  handleSubmit: () => void;
  initAuthentication: (data: FormState) => void;
  handleKeyNav: (e: KeyboardEvent) => void;
  pushRouter: (str: string) => Dispatch;
  isUserLoggedIn: () => Dispatch;
}

const lifecycleMethods: ReactLifeCycleFunctions<Props, {}> = {
  componentDidMount() {
    const { isUserLoggedIn, pushRouter, handleKeyNav } = this.props;

    window.addEventListener('keypress', handleKeyNav);

    isUserLoggedIn && pushRouter('/dashboard');
  },
  componentWillUnmount() {
    window.removeEventListener('keypress', this.props.handleKeyNav);
  },
};

const handlers = {
  setUsername: (props: Props) => (e: any) => {
    const { setFormState, formState } = props;
    setFormState({ ...formState, username: e.target.value });
  },
  setEmail: (props: Props) => (e: any) => {
    const { setFormState, formState } = props;
    setFormState({ ...formState, email: e.target.value });
  },
  setPassword: (props: Props) => (e: any) => {
    const { setFormState, formState } = props;
    setFormState({ ...formState, password: e.target.value });
  },
  handleSubmit: (props: Props) => () => {
    props.initAuthentication(props.formState);
  },
};

const handlers2 = {
  handleKeyNav: (props: Props) => (e: KeyboardEvent) => {
    e.keyCode === 13 && props.handleSubmit();
  },
};

const mapStateToProps = ({ router, global }: State) => ({
  location: router.location,
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
  withState('formState', 'setFormState', {
    username: '',
    email: '',
    password: '',
  }),
  withHandlers(handlers),
  withHandlers(handlers2),
  lifecycle<Props, {}>(lifecycleMethods),
)(FormComponent);
