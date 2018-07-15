import React, { ComponentType } from 'react';
import { NavLink } from "react-router-dom";
import { push } from "connected-react-router";
import { connect, Dispatch } from "react-redux";
import { compose, withState, withHandlers, lifecycle } from "recompose";

import { State } from "../../store";
import { actions } from "../../actions";

interface FormState {
    username: string;
    email: string;
    password: string;
}

interface Props {
    formState: FormState;
    setFormState: (obj: any) => void;
    setUsername: (props: any) => void;
    setEmail: (props: any) => void;
    setPassword: (props: any) => void;
    handleSubmit: (e: any) => void;
    saveFormDataIntoStore: (state: object) => void;
    initAuthentication: () => void;
    location: any;
}

const lifecycleMethods = {
    componentDidMount() {
        const { isUserLoggedIn, pushRouter } = this.props;
        isUserLoggedIn && pushRouter("/dashboard");
    }
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
    handleSubmit: (props: Props) => (e: any) => {
        e.preventDefault();

        props.saveFormDataIntoStore(props.formState);
        props.initAuthentication();
        props.saveFormDataIntoStore({});
    }
};

const FormComponent: ComponentType<Props> = ({ formState, setUsername, setEmail, setPassword, location, handleSubmit }: Props) => {
    const currentRoute = location.pathname.toLowerCase().slice(1);
    const formHeading = currentRoute === 'login' ? 'welcome to login' : 'welcome to signup';

    return (<div>
        <p>{formHeading}</p>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">SignUp</NavLink>
        <br />
        <form onSubmit={handleSubmit}>
            {currentRoute === 'signup' && <input placeholder="username" value={formState.username} onChange={setUsername} />}
            <input placeholder="email" value={formState.email} onChange={setEmail} />
            <input placeholder="password" type="password" value={formState.password} onChange={setPassword} />
            <button>SEND</button>
        </form>
    </div>);
};

const mapStateToProps = ({ router, global }: State) => ({
    location: router.location,
    isUserLoggedIn: global.isUserLoggedIn
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    saveFormDataIntoStore: (data: FormState) => dispatch(actions.global.saveFormDataIntoStore(data)),
    initAuthentication: () => dispatch(actions.global.initAuthentication()),
    pushRouter: (str: string) => dispatch(push(str))
});

export const Form = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withState('formState', 'setFormState', {
        username: "",
        email: "",
        password: ""
    }),
    withHandlers(handlers),
    lifecycle<Props, {}>(lifecycleMethods)
)(FormComponent);
