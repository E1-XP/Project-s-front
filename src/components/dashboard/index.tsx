import React, { ComponentType } from 'react';
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Dispatch } from 'redux';
import { compose } from "recompose";

import { State, Users, Rooms, UserData, ChatsGeneral } from "../../store"
import { actions } from "../../actions";
import { Socket } from "../../services/socket.service";

interface Props {
    user: UserData;
    users: Users;
    rooms: Rooms;
    messages: ChatsGeneral[];
    setIsLoading: (v: boolean) => Dispatch;
    pushRouter: (v: string) => Dispatch;
}

export const DashboardComponent: ComponentType<Props> = (props) => {
    let inputVal: any;

    const createRoom = () => {
        const name = prompt('name?');
        const isPrivate = prompt('private?');

        console.log(name);

        Socket.emit('room/create', {
            roomName: name,
            userId: props.user.id
        });
        props.setIsLoading(true);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        Socket.emit('general/messages', {
            message: inputVal.value,
            author: props.user.username
        });
    }

    const handleRoomClick = (e: any) => {
        props.pushRouter(`/room/${e.target.dataset.id}`);
    }

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
                    Object.keys(props.rooms.list).map((itm) => <li data-id={itm} key={itm}
                        onClick={handleRoomClick}>{props.rooms.list[itm].name}</li>)
                    : 'no rooms created'}
            </ul>
            <button onClick={createRoom}>create new room</button>
            <h2>general chat</h2>
            <ul>
                {props.messages.length ?
                    props.messages.map((itm: any, i: number) => <li key={i}>{itm.message}-{itm.author}</li>)
                    : 'no messages'}
            </ul>
            <form onSubmit={handleSubmit}>
                <input ref={node => inputVal = node} placeholder="type here..." />
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
    setIsLoading: (bool: boolean) => dispatch(actions.global.setIsLoading(bool))
});

export const Dashboard = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(DashboardComponent);
