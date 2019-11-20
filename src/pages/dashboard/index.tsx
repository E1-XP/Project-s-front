import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { Dispatch } from 'redux';

import { State, Users, UserData, ChatMessage } from '../../store/interfaces';
import { actions } from '../../actions';

import { DashboardComponent } from './template';

export interface Props {
  user: UserData;
  users: Users;
  messages: ChatMessage[];
  initSendGeneralMessage: (data: any) => Dispatch;
  handleMessageSubmit: (e: any) => void;
  setState: (v: any) => void;
}

const handlers = {
  handleMessageSubmit: (props: Props) => (value: string) => {
    props.initSendGeneralMessage({
      message: value,
      authorId: props.user.id,
      author: props.user.username,
    });
  },
};

const mapStateToProps = ({ user, users, chats }: State) => ({
  users,
  user: user.userData,
  messages: chats.general,
});

const mapDispatchToProps = {
  setMessages: actions.chats.setMessages,
  initSendGeneralMessage: actions.chats.initSendGeneralMesssage,
};

export const Dashboard = compose<Props, {}>(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(handlers),
)(DashboardComponent);

export default Dashboard;
