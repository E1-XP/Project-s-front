import { createRef, Ref } from 'react';
import {
  compose,
  withState,
  withHandlers,
  lifecycle,
  ReactLifeCycleFunctions,
} from 'recompose';

import { ChatMessage } from '../../store/interfaces';

import { ChatComponent } from './template';

export interface Props {
  state: string;
  setState: (e: any) => void;
  setMessage: (e: any) => void;
  handleMessageSubmit: (e: any) => void;
  onListRef: () => void;
  scrollTo: () => void;
  getListRef: () => Ref<any>;
}

export interface PassedProps {
  messages: ChatMessage[];
  handleSubmit: (e: any) => void;
}

export type CombinedProps = Props & PassedProps;

const hooks: ReactLifeCycleFunctions<CombinedProps, {}> = {
  componentDidUpdate(prevP: CombinedProps) {
    if (prevP.messages.length !== this.props.messages.length) {
      requestAnimationFrame(this.props.scrollTo);
    }
  },
};

const handlers = () => {
  let listRef: any = createRef();

  return {
    onListRef: (props: CombinedProps) => (ref: any) => (listRef = ref),
    getListRef: (props: CombinedProps) => () => listRef,
    setMessage: (props: CombinedProps) => (e: any) => {
      props.setState(e.target.value);
    },
    handleMessageSubmit: (props: CombinedProps) => (e: any) => {
      if (!props.state.length) return;

      props.handleSubmit(props.state);
      props.setState('');
    },
    scrollTo: (props: CombinedProps) => (timestamp: number) => {
      const animTime = 2000;
      listRef.parentElement.scrollTop = listRef.getBoundingClientRect().height;
      // requestAnimationFrame()
    },
  };
};

export const Chat = compose<CombinedProps, PassedProps>(
  withState('state', 'setState', ''),
  withHandlers(handlers),
  lifecycle(hooks),
)(ChatComponent);
