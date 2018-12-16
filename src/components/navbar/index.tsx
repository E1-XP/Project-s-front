import { compose, withHandlers } from "recompose";
import { connect, Dispatch } from "react-redux";

import { actions } from "../../actions";
import { State, UserData } from "../../store";

import { NavbarComponent } from "./template";

export interface Props {
  isUserLoggedIn: boolean;
  userData: UserData;
  inboxCount: number;
  handleLogout: () => void;
}

const handlers = {
  handleLogout: (props: any) => (e: any) => {
    props.initLogout();
  }
};

const mapStateToProps = ({ user, global }: State) => ({
  isUserLoggedIn: global.isUserLoggedIn,
  userData: user.userData,
  inboxCount: global.inboxCount
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initLogout: () => dispatch(actions.global.initLogout())
});

export const Navbar = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers(handlers)
)(NavbarComponent);
