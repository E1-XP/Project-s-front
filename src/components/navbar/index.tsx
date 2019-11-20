import { compose, withHandlers, onlyUpdateForKeys } from 'recompose';
import { connect } from 'react-redux';

import { actions } from '../../actions';
import { State, UserData } from '../../store/interfaces';

import { NavbarComponent } from './template';

export interface Props {
  isUserLoggedIn: boolean;
  userData: UserData;
  inboxCount: number;
  handleLogout: () => void;
}

const mapStateToProps = ({ user, global }: State) => ({
  isUserLoggedIn: global.isUserLoggedIn,
  userData: user.userData,
  inboxCount: user.inboxCount,
});

const mapDispatchToProps = {
  handleLogout: actions.global.initLogout,
};

export const Navbar = compose<Props, {}>(
  connect(mapStateToProps, mapDispatchToProps),
  onlyUpdateForKeys(['inboxCount', 'isUserLoggedIn']),
)(NavbarComponent);
