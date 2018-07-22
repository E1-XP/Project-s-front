import React, { ComponentType } from 'react';
import { NavLink } from "react-router-dom";
import { compose, withHandlers } from "recompose";
import { connect, Dispatch } from "react-redux";

import { actions } from "../actions";
import { State, UserData } from "../store";

type Props = {
    userData: UserData;
    handleLogout: () => void;
}

export const NavbarComponent: ComponentType<Props> = (props: Props) => {
    if (!props.userData) return null;
    const { username } = props.userData;

    return (<div>
        <p>Welcome {username}</p>
        <nav>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <a href="#" onClick={props.handleLogout}>Logout</a>
        </nav>
    </div>);
};

const mapStateToProps = ({ user }: State) => ({
    userData: user.userData
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    initLogout: () => dispatch(actions.global.initLogout())
});

export const Navbar = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleLogout: (props: any) => (e: any) => {
            props.initLogout();
        }
    })
)(NavbarComponent);
