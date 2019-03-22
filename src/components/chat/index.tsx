import { createRef, Ref } from 'react';
import {
  compose,
  withState,
  withHandlers,
  lifecycle,
  ReactLifeCycleFunctions,
  onlyUpdateForKeys,
} from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { writeMessage } from './../../actions/chats';

import { ChatMessage, State } from '../../store/interfaces';

import { ChatComponent } from './template';

export interface Props {
  state: string;
  isWriting: boolean;
  writers: string[];
  setState: (e: any) => void;
  onMessageWrite: (e: any) => void;
  writeMessage: () => Dispatch;
  handleMessageSubmit: (e: any) => void;
  onListRef: () => void;
  scrollToBottom: () => void;
  getListRef: () => Ref<any>;
}

export interface PassedProps {
  messages: ChatMessage[];
  handleSubmit: (e: any) => void;
}

export type CombinedProps = Props & PassedProps;

const hooks: ReactLifeCycleFunctions<CombinedProps, {}> = {
  componentDidUpdate(prevP: CombinedProps) {
    if (prevP.messages.length < this.props.messages.length) {
      this.props.scrollToBottom;
    }
  },
};

const handlers = () => {
  let listRef: any = createRef();

  return {
    onListRef: (props: CombinedProps) => (ref: any) => (listRef = ref),
    getListRef: (props: CombinedProps) => () => listRef,
    onMessageWrite: (props: CombinedProps) => (e: any) => {
      props.setState(e.target.value);
      props.writeMessage();
    },
    handleMessageSubmit: (props: CombinedProps) => (e: any) => {
      if (!props.state.length) return;

      props.handleSubmit(props.state);
      props.setState('');
    },
    scrollToBottom: (props: CombinedProps) => (timestamp: number) => {
      const animTime = 2000;
      listRef.parentElement.scrollTop = listRef.getBoundingClientRect().height;
    },
  };
};

export const Chat = compose<CombinedProps, PassedProps>(
  connect(
    ({ chats, users }: State) => ({
      isWriting: chats.isWriting,
      writers: !!chats.writersById.length
        ? chats.writersById.map(id => users.general[id])
        : [],
    }),
    { writeMessage },
  ),
  withState('state', 'setState', ''),
  withHandlers(handlers),
  lifecycle(hooks),
  onlyUpdateForKeys(['state', 'messages', 'isWriting', 'writers']),
)(ChatComponent);
