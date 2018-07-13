import React from 'react';
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Dispatch } from 'redux';
import { compose } from "recompose";

import { State } from "../../store"
import { actions } from "../../actions";
import { Socket } from "../../services/socket.service";

interface Props {
    user: object;
    users: object;
    rooms: object;
    setUsers: (data: string[]) => object;
}

export const DashboardComponent = (props: any) => {
    let inputVal: any;

    const createRoom = () => {
        const name = prompt('name?');
        console.log(name)

        Socket.emit('room/create', name);
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
                    Object.keys(props.rooms.list).map((itm: string, i: number) => <li data-id={itm} key={itm}
                        onClick={handleRoomClick}>{props.rooms.list[itm]}</li>)
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
    setMessagse: (payload: any) => dispatch(actions.chats.setMessages(payload))
});

export const Dashboard = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(DashboardComponent);
