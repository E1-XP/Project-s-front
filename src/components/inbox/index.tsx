import { compose, lifecycle, ReactLifeCycleFunctions } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { push } from 'connected-react-router';

import { actions } from '../../actions';
import { State, User, Users, RoomsList } from '../../store';

import { InboxComponent } from './template';

export interface Props {
  user: User;
  users: Users;
  rooms: RoomsList;
  pushRouter: (s: string) => Dispatch;
  initCheckInbox: () => Dispatch;
  setInboxCount: (v?: number) => Dispatch;
}

const hooks: ReactLifeCycleFunctions<Props, {}> = {
  componentDidMount() {
    this.props.initCheckInbox();
    this.props.setInboxCount(0);
  },
};

const mapStateToProps = ({ user, users, rooms }: State) => ({
  user,
  users,
  rooms: rooms.list,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initCheckInbox: () => dispatch(actions.user.initCheckInbox()),
  setInboxCount: (v?: number) => dispatch(actions.global.setInboxCount(v)),
  pushRouter: (s: string) => dispatch(push(s)),
});

export const Inbox = compose<Props, {}>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle<Props, {}>(hooks),
)(InboxComponent);
