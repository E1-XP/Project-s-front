import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { push } from 'connected-react-router';

import { State, User, Users, RoomsList } from '../../store/interfaces';

import { InboxComponent } from './template';

import { withAuthentication } from '../../HOCs/withAuthentication';

export interface Props {
  user: User;
  users: Users;
  rooms: RoomsList;
  pushToRoom: (e: any) => void;
  pushRouter: (s: string) => Dispatch;
  getDateFormat: (d: Date) => string;
}

const mapStateToProps = ({ user, users, rooms }: State) => ({
  user,
  users,
  rooms: rooms.list,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  pushRouter: (s: string) => dispatch(push(s)),
});

export const Inbox = compose<Props, {}>(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    pushToRoom: ({ pushRouter }: Props) => (e: any) => {
      pushRouter(`/room/${e.target.closest('button').dataset.id}`);
    },
    getDateFormat: ({}: Props) => (d: Date) => {
      const addZero = (num: number) => (num < 10 ? `0${num}` : num);

      return `${d.getFullYear()}.${addZero(d.getMonth() + 1)}.${addZero(
        d.getDate(),
      )}`;
    },
  }),
  withAuthentication,
)(InboxComponent);

export default Inbox;
