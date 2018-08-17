import React, { ComponentType } from 'react';
import { NavLink } from "react-router-dom";
import { compose, withHandlers } from "recompose";
import { connect, Dispatch } from "react-redux";

import { actions } from "../../actions";
import { State, UserData } from "../../store";

interface Props {
    userData: UserData;
    inboxCount: number;
    handleLogout: () => void;
}

const handlers = {
    handleLogout: (props: any) => (e: any) => {
        props.initLogout();
    }
};

export const NavbarComponent: ComponentType<Props> = (props) => {
    if (!props.userData) return null;
    const { username } = props.userData;

    return (<div>
        <p>Welcome {username}</p>
        <nav>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/Inbox">
                {props.inboxCount ? `*You have ${props.inboxCount} new messages*` : 'Inbox'}
            </NavLink>
            <a href="#" onClick={props.handleLogout}>Logout</a>
        </nav>
    </div>);
};

const mapStateToProps = ({ user, global }: State) => ({
    userData: user.userData,
    inboxCount: global.inboxCount
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    initLogout: () => dispatch(actions.global.initLogout())
});

export const Navbar = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers(handlers)
)(NavbarComponent);
