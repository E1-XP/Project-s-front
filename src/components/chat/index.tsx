import { compose, withState, withHandlers } from 'recompose';

import { ChatMessage } from '../../store';

import { ChatComponent } from './template';

export interface Props {
    state: string;
    setState: (e: any) => void;
    setMessage: (e: any) => void;
    handleMessageSubmit: (e: any) => void;
}

export interface PassedProps {
    messages: ChatMessage[];
    handleSubmit: (e: any) => void;
}

const handlers = {
    setMessage: (props: Props) => (e: any) => {
        props.setState(e.target.value);
    },
    handleMessageSubmit: (props: Props & PassedProps) => (e: any) => {
        props.handleSubmit(props.state);
        props.setState('');
    }
};

export const Chat = compose<Props, PassedProps>(
    withState('state', 'setState', ''),
    withHandlers(handlers)
)(ChatComponent);
