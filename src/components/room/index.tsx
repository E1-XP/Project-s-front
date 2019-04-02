import {
  compose,
  lifecycle,
  withHandlers,
  withState,
  ReactLifeCycleFunctions,
  shouldUpdate,
} from 'recompose';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import { State, Rooms, UserData, Chats } from '../../store/interfaces';
import { actions } from '../../actions';

import { RoomComponent } from './template';

interface Params {
  id: string;
}

export interface Props extends RouteComponentProps<Params> {
  message: string;
  rooms: Rooms;
  chats: Chats;
  user: UserData;
  isRoomUndefined: () => boolean;
  isUserAdmin: (itm: string | number | null, prevRooms?: Rooms) => boolean;
  handleBeforeUnload: (e: BeforeUnloadEvent) => void;
  changeRoomOwner: () => void;
  initSendRoomMessage: (data: any) => Dispatch;
  handleSubmit: () => void;
  setState: (v: any) => void;
  initRoomAdminChange: (data: any) => Dispatch;
  initRoomEnter: () => Dispatch;
  initRoomLeave: () => Dispatch;
  setMessage: (e: any) => void;
}

const hooks: ReactLifeCycleFunctions<Props, {}> = {
  componentDidMount() {
    const roomExistAndUserIsAdmin =
      !this.props.isRoomUndefined() &&
      this.props.isUserAdmin(this.props.user.id);

    if (roomExistAndUserIsAdmin) {
      window.addEventListener('beforeunload', this.props.handleBeforeUnload);
    }
  },
  componentWillUnmount() {
    this.props.initRoomLeave();

    if (this.props.isUserAdmin(this.props.user.id)) {
      window.removeEventListener('beforeunload', this.props.handleBeforeUnload);
    }
  },
  componentDidUpdate(prevP: Props) {
    const { isUserAdmin, user, handleBeforeUnload } = this.props;
    const { rooms } = prevP;

    if (this.props.isRoomUndefined()) return;

    const roomListLoaded = prevP.rooms.list !== undefined;
    const isRoomListAvailable = roomListLoaded
      ? Object.keys(prevP.rooms.list).length
      : false;

    if (
      isRoomListAvailable &&
      !isUserAdmin(prevP.user.id, rooms) &&
      isUserAdmin(user.id)
    ) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else if (
      isRoomListAvailable &&
      isUserAdmin(prevP.user.id, rooms) &&
      !isUserAdmin(user.id)
    ) {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  },
};

const handlers = {
  isRoomUndefined: (props: Props) => () => {
    const roomId = props.match.params.id;

    if (props.rooms.list === undefined) return true;
    return props.rooms.list[roomId] === undefined;
  },
  isUserAdmin: (props: Props) => (
    itm: string | number | null,
    prevRooms?: Rooms,
  ) => {
    const roomId = props.match.params.id;

    if (!Object.keys(props.rooms.list).length) return false;

    if (itm === null) return false;

    const adminId = prevRooms
      ? prevRooms.list[roomId].adminId
      : props.rooms.list[roomId].adminId;

    return Number(itm) === Number(adminId);
  },
  handleBeforeUnload: (props: Props) => (e: BeforeUnloadEvent) => {
    const message = 'Are you sure?';
    e.returnValue = message;
    return message;
  },
  setMessage: (props: Props) => (e: any) => {
    props.setState(e.target.value);
  },
  handleSubmit: (props: Props) => (value: string) => {
    props.initSendRoomMessage({
      message: value,
      author: props.user.username,
      authorId: props.user.id,
      roomId: props.match.params.id,
    });
  },
  changeRoomOwner: (props: Props) => (e: any) => {
    const roomId = props.match.params.id;
    const userId = Number(e.target.closest('li').dataset.id);

    props.initRoomAdminChange({ roomId, userId });
  },
};

const mapStateToProps = ({ rooms, chats, user }: State) => ({
  rooms,
  chats,
  user: user.userData,
});

const mapDispatchToProps = {
  initRoomEnter: actions.rooms.initRoomEnter,
  initRoomLeave: actions.rooms.initRoomLeave,
  setCurrentRoom: actions.rooms.setCurrentRoom,
  setRoomUsers: actions.users.setRoomUsers,
  setMessages: actions.chats.setMessages,
  initSendRoomMessage: actions.chats.initSendRoomMesssage,
  initRoomAdminChange: actions.rooms.initRoomAdminChange,
};

export const Room = compose<Props, {}>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('message', 'setState', ''),
  withHandlers(handlers),
  lifecycle<Props, {}>(hooks),
  shouldUpdate<Props>((curr, next) => false), // curr.match === next.match),
)(RoomComponent);
