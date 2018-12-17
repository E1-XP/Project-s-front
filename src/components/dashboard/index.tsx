import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { push } from 'connected-react-router';
import { Dispatch } from 'redux';

import { State, Users, Rooms, UserData, ChatMessage } from '../../store';
import { actions } from '../../actions';

import { DashboardComponent } from './template';

export interface Props {
  user: UserData;
  users: Users;
  rooms: Rooms;
  messages: ChatMessage[];
  setIsLoading: (v: boolean) => Dispatch;
  pushRouter: (v: string) => Dispatch;
  initSendGeneralMessage: (data: any) => Dispatch;
  goToCreateRoom: () => void;
  handleRoomClick: (e: any) => void;
  handleMessageSubmit: (e: any) => void;
  setState: (v: any) => void;
}

const handlers = {
  goToCreateRoom: (props: Props) => () => {
    props.pushRouter('/room/create');
  },
  handleRoomClick: (props: Props) => (e: any) => {
    const id = e.target.closest('li').dataset.id;

    props.pushRouter(`/room/${id}`);
  },
  handleMessageSubmit: (props: Props) => (value: string) => {
    props.initSendGeneralMessage({
      message: value,
      authorId: props.user.id,
      author: props.user.username,
    });
  },
};

const mapStateToProps = ({ user, users, chats, rooms }: State) => ({
  users,
  rooms,
  user: user.userData,
  messages: chats.general,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  pushRouter: (str: string) => dispatch(push(str)),
  setMessages: (payload: any) => dispatch(actions.chats.setMessages(payload)),
  setIsLoading: (bool: boolean) => dispatch(actions.global.setIsLoading(bool)),
  initSendGeneralMessage: (data: any) =>
    dispatch(actions.chats.initSendGeneralMesssage(data)),
});

export const Dashboard = compose<Props, {}>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers(handlers),
)(DashboardComponent);
