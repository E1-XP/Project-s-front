import React, { ComponentType } from 'react';
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Dispatch } from 'redux';
import { compose, withHandlers, withState } from "recompose";

import { State, Users, Rooms, UserData, ChatsGeneral } from "../../store";
import { actions } from "../../actions";

interface Props {
    user: UserData;
    users: Users;
    rooms: Rooms;
    messages: ChatsGeneral[];
    setIsLoading: (v: boolean) => Dispatch;
    pushRouter: (v: string) => Dispatch;
    initSendGeneralMessage: (data: any) => Dispatch;
    goToCreateRoom: () => void;
    handleRoomClick: (e: any) => void;
    handleMessageSubmit: (e: any) => void;
    setMessage: (e: any) => void;
    setState: (v: any) => void;
    state: string;
}

const handlers = {
    setMessage: (props: Props) => (e: any) => {
        props.setState(e.target.value);
    },
    goToCreateRoom: (props: Props) => () => {
        props.pushRouter('/room/create');
    },
    handleRoomClick: (props: Props) => (e: any) => {
        const id = e.target.dataset.id;

        props.pushRouter(`/room/${id}`);
    },
    handleMessageSubmit: (props: Props) => (e: any) => {
        e.preventDefault();

        props.initSendGeneralMessage({
            message: props.state,
            author: props.user.username
        });
    }
};

export const DashboardComponent: ComponentType<Props> = (props) => {
    const { handleMessageSubmit, handleRoomClick, goToCreateRoom, setMessage } = props;

    return (
        <div>
            <h1>Currently online: {Object.keys(props.users.general).length}</h1>
            <ul>
                {Object.keys(props.users.general)
                    .map((key: string) => (<li key={key}>{key}</li>))}
            </ul>
            <h2>Available rooms:</h2>
            <ul>
                {Object.keys(props.rooms.list).length ?
                    Object.keys(props.rooms.list).map((itm) =>
                        <li data-id={itm} key={itm}
                            onClick={handleRoomClick}>
                            {props.rooms.list[itm].name}
                            {props.rooms.list[itm].isPrivate && ' private'}
                        </li>)
                    : 'no rooms created'}
            </ul>
            <button onClick={goToCreateRoom}>create new room</button>
            <h2>general chat</h2>
            <ul>
                {props.messages.length ?
                    props.messages.map((itm: any, i: number) => <li key={i}>{itm.message}-{itm.author}</li>)
                    : 'no messages'}
            </ul>
            <form onSubmit={handleMessageSubmit}>
                <input value={props.state} onChange={setMessage} placeholder="type here..." />
                <button >Submit</button>
            </form>
        </div>
    );
};

const mapStateToProps = ({ user, users, chats, rooms }: State) => ({
    user: user.userData,
    users,
    rooms,
    messages: chats.general
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    pushRouter: (str: string) => dispatch(push(str)),
    setMessages: (payload: any) => dispatch(actions.chats.setMessages(payload)),
    setIsLoading: (bool: boolean) => dispatch(actions.global.setIsLoading(bool)),
    initSendGeneralMessage: (data: any) => dispatch(actions.chats.initSendGeneralMesssage(data))
});

export const Dashboard = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withState('state', 'setState', ''),
    withHandlers(handlers)
)(DashboardComponent);
