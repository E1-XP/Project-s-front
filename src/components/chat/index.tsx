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

import { ChatMessage, UserData, State } from '../../store/interfaces';

import { ChatComponent } from './template';

import { getWriters } from './../../selectors/getWriters';

export interface Props {
  state: CState;
  isWriting: boolean;
  writers: string[];
  user: UserData;
  setState: (s: CState) => void;
  onMessageWrite: (e: any) => void;
  writeMessage: () => Dispatch;
  handleMessageSubmit: (e: any) => void;
  onListRef: () => void;
  scrollToBottom: () => void;
  getListRef: () => Ref<any>;
  toggleEmojiPicker: () => void;
  handleEmojiClick: (v: any) => void;
}

export interface PassedProps {
  messages: ChatMessage[];
  handleSubmit: (e: any) => void;
}

export type CombinedProps = Props & PassedProps;

interface CState {
  isEmojiPickerOpen: boolean;
  message: string;
  emojiPickerAnchorRef: HTMLElement | null;
}

const hooks: ReactLifeCycleFunctions<CombinedProps, {}> = {
  componentDidMount() {
    this.props.scrollToBottom();
  },
  componentDidUpdate(prevP: CombinedProps) {
    if (prevP.messages.length < this.props.messages.length) {
      this.props.scrollToBottom();
    }
  },
};

const handlers = () => {
  let listRef: any = createRef();

  return {
    onListRef: (props: CombinedProps) => (ref: any) => (listRef = ref),
    getListRef: (props: CombinedProps) => () => listRef,
    onMessageWrite: (props: CombinedProps) => (e: any) => {
      props.setState({ ...props.state, message: e.target.value });
      props.writeMessage();
    },
    handleMessageSubmit: ({ state, setState, handleSubmit }: CombinedProps) => (
      e: any,
    ) => {
      const invalidKey = e.keyCode !== 13;
      const emptyText = !state.message.length || !/\S/i.test(state.message);
      if (invalidKey || emptyText) return;
      console.log(state.message);
      handleSubmit(state.message);
      setState({ ...state, message: '' });
    },
    scrollToBottom: (props: CombinedProps) => () => {
      listRef.parentElement.scrollTop = listRef.getBoundingClientRect().height;
    },
    toggleEmojiPicker: (props: CombinedProps) => (e: any) => {
      const isEmojiPickerOpen = !props.state.isEmojiPickerOpen;

      props.setState({
        ...props.state,
        isEmojiPickerOpen,
        emojiPickerAnchorRef: e.currentTarget,
      });
    },
    handleEmojiClick: ({ setState, state }: CombinedProps) => (v: string) => {
      const emoji = String.fromCodePoint(Number(`0x${v}`));
      setState({ ...state, message: `${state.message}${emoji}` });
    },
  };
};

export const Chat = compose<CombinedProps, PassedProps>(
  connect(
    (state: State) => ({
      isWriting: state.chats.isWriting,
      writers: getWriters(state),
      user: state.user.userData,
    }),
    { writeMessage },
  ),
  withState('state', 'setState', {
    message: '',
    isEmojiPickerOpen: false,
    emojiPickerAnchorRef: null,
  }),
  withHandlers(handlers),
  lifecycle(hooks),
)(ChatComponent);
