import React, { ComponentType, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import './style.scss';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Badge from '@material-ui/core/Badge';

import { Props } from "./index";

export const NavbarComponent: ComponentType<Props> = ({
    isUserLoggedIn, userData, inboxCount, handleLogout }) => {

    // if (!userData) return (<p>Loading..</p>);

    return (<AppBar id="navbar" position="static" color="default">
        <Toolbar className="toolbar">
            <NavLink to="/dashboard">
                <Typography variant="title" color="inherit" >
                    Project-S </Typography>
            </NavLink>
            <div>
                {isUserLoggedIn ?
                    <Fragment>
                        <Typography variant="body2" color="primary" style={{
                            display: 'inline-block',
                            paddingRight: '.5rem'
                        }}>
                            WELCOME {userData.username.toUpperCase()}
                        </Typography>
                        <NavLink to="/inbox">
                            <IconButton color="inherit" >
                                {inboxCount ?
                                    <Badge badgeContent={inboxCount} color="secondary" >
                                        <Icon color="primary">notifications</Icon>
                                    </Badge> :
                                    <Icon color="primary">notifications</Icon>}
                            </IconButton>
                        </NavLink>
                        <IconButton color="inherit" >
                            <Icon color="primary">settings</Icon>
                        </IconButton>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </Fragment> :
                    <Fragment>
                        <NavLink to="/login">
                            <Button color="inherit" >Login</Button>
                        </NavLink>
                        <NavLink to="/signup">
                            <Button color="inherit" >Sign Up</Button>
                        </NavLink>
                    </Fragment>}
            </div>
        </Toolbar>
    </AppBar >);
};
