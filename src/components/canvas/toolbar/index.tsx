import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { compose, withHandlers, withState, onlyUpdateForKeys } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { actions } from '../../../actions';
import { State, Rooms, UserData, Users } from '../../../store/interfaces';

import { CanvasNavbarComponent } from './template';

export interface InvitationData {
  roomId: number;
  senderId: number;
  senderName: string;
  receiverId: number;
}

interface Params {
  id: string;
}

export interface Props extends RouteComponentProps<Params> {
  isModalOpen: boolean;
  setState: (v: boolean) => void;
  closeModal: () => void;
  openModal: () => void;
  rooms: Rooms;
  user: UserData;
  users: Users;
  isUserAdmin: (itm: number | null) => boolean;
  handleLoadImage: () => void;
  sendInvitationLink: () => void;
  initSendRoomInvitation: (data: InvitationData) => Dispatch;
  toggleColorPicker: () => void;
}

export interface PassedProps {
  isColorPickerOpen: boolean;
  weight: number;
  setSelectedColor: (e: any) => void;
  handleResetBtn: () => void;
  setIsImageSelectorOpen: (v?: boolean) => void;
  setIsColorPickerOpen: (v: boolean) => void;
  setWeight: (e: any, v: number) => void;
}

export type CombinedProps = Props & PassedProps;

const handlers = {
  isUserAdmin: (props: Props) => (id: string | null) => {
    if (id === null) return false;
    return id === props.rooms.list[props.match.params.id].adminId;
  },
  handleLoadImage: (props: Props & PassedProps) => () => {
    props.setIsImageSelectorOpen();
  },
  sendInvitationLink: (props: Props) => (e: any) => {
    const roomId = Number(props.match.params.id);
    const senderId = props.user.id;
    const senderName = props.user.username;
    const receiverId = e.target.closest('li').dataset.id;

    if (senderId === null) throw new Error('senderId is not a value');

    props.initSendRoomInvitation({ roomId, senderId, senderName, receiverId });
  },
  toggleColorPicker: (props: Props & PassedProps) => () => {
    const value = !props.isColorPickerOpen;
    props.setIsColorPickerOpen(value);
  },
  openModal: (props: Props) => () => {
    props.setState(true);
  },
  closeModal: (props: Props) => () => {
    props.setState(false);
  },
};

const mapStateToProps = ({ user, users, rooms }: State) => ({
  users,
  rooms,
  user: user.userData,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initSendRoomInvitation: (data: InvitationData) =>
    dispatch(actions.user.initSendRoomInvitation(data)),
});

export const CanvasNavbar = compose<CombinedProps, PassedProps>(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('isModalOpen', 'setState', false),
  withHandlers(handlers),
  onlyUpdateForKeys([
    'users',
    'rooms',
    'user',
    'isModalOpen',
    'isColorPickerOpen',
    'weight',
  ]),
)(CanvasNavbarComponent);
