import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Badge from '@material-ui/core/Badge';

import { Props } from './index';

const AppBarWithGradient = styled(AppBar)`
  background: linear-gradient(to right, #ff00cc, #333399);
`;

const UserWelcomeTxt = styled(Typography)`
  && {
    display: inline-block;
    padding-right: 0.5rem;
  }
`;

const CustomToolbar = styled(Toolbar)`
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  width: inherit;
`;

export const NavbarComponent = ({
  isUserLoggedIn,
  userData,
  inboxCount,
  handleLogout,
}: Props) => (
  <AppBarWithGradient position="static" color="primary">
    <CustomToolbar>
      <NavLink to="/dashboard">
        <Typography variant="h6" color="inherit">
          Project-S
        </Typography>
      </NavLink>
      <div>
        {isUserLoggedIn ? (
          <>
            <UserWelcomeTxt variant="body1" color="inherit">
              WELCOME {userData.username.toUpperCase()}
            </UserWelcomeTxt>
            <NavLink to="/inbox">
              <IconButton color="inherit">
                {inboxCount ? (
                  <Badge badgeContent={inboxCount} color="secondary">
                    <Icon color="primary">notifications</Icon>
                  </Badge>
                ) : (
                  <Icon color="inherit">notifications</Icon>
                )}
              </IconButton>
            </NavLink>
            <NavLink to="/gallery">
              <IconButton color="inherit">
                <Icon color="inherit">photo_library</Icon>
              </IconButton>
            </NavLink>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink to="/login">
              <Button color="inherit">Login</Button>
            </NavLink>
            <NavLink to="/signup">
              <Button color="inherit">Sign Up</Button>
            </NavLink>
          </>
        )}
      </div>
    </CustomToolbar>
  </AppBarWithGradient>
);
