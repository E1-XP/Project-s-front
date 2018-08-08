import React from 'react';
import { compose, lifecycle, withHandlers } from "recompose";
import { connect } from "react-redux";
import { RouteComponentProps, Prompt } from 'react-router-dom';
import { Dispatch } from 'redux';

import { State, Rooms } from "../../store";
import { actions } from "../../actions";
import { Socket } from '../../services/socket.service';

import { Canvas } from "./canvas";

interface Params {
    id: string;
}

interface Props extends RouteComponentProps<Params> {
    rooms: Rooms;
    isSocketConnected: boolean;
    isUserAdmin: (itm: string) => boolean;
    handleBeforeUnload: (e: BeforeUnloadEvent) => void;
}

const hooks = {
    componentDidMount() {
        console.log('SOCKET CONNECTED?' + this.props.isSocketConnected);
        setTimeout(this.props.initRoomEnter, 500);

        this.props.isUserAdmin(this.props.user.id) &&
            window.addEventListener('beforeunload', this.props.handleBeforeUnload);
    },
    componentWillUnmount() {
        this.props.initRoomLeave();

        this.props.isUserAdmin(this.props.user.id) &&
            window.removeEventListener('beforeunload', this.props.handleBeforeUnload);
    }
};

export const handlers = {
    isUserAdmin: (props: Props) => (itm: string) => {
        return itm === props.rooms.list[props.match.params.id].adminId;
    },
    handleBeforeUnload: (props: Props) => (e: BeforeUnloadEvent) => {
        const message = 'Are you sure?';
        e.returnValue = message;
        return message;
    }
};

export const RoomComponent = (props: any) => {
    const { selectedRoom } = props.chats;

    let inputVal: HTMLInputElement;
    let board: HTMLCanvasElement;

    const handleSubmit = (e: any) => {
        e.preventDefault();

        Socket.emit(`${props.match.params.id}/messages`, {
            message: inputVal.value,
            author: props.user.username
        });
    }

    if (!props.isSocketConnected || !Object.keys(props.rooms.list).length) return <p>loading...</p>;

    return (<div>
        <section style={{ float: 'left' }}>
            <h1>room {props.rooms.list[props.match.params.id].name}</h1>
            <h2>currently online</h2>
            <ul>
                {Object.keys(props.users.selectedRoom).length ?
                    Object.keys(props.users.selectedRoom).map((itm, i) =>
                        <li
                            style={{ color: props.isUserAdmin(Number(itm)) ? '#f32' : '#fff' }} key={i}>
                            {props.users.selectedRoom[itm]}
                        </li>) :
                    'no users'}
            </ul>
            <ul>
                {Object.keys(selectedRoom).length ?
                    Object.keys(selectedRoom).map((itm, i) =>
                        <li key={i}>{selectedRoom[itm].message}-{selectedRoom[itm].author}</li>) :
                    'no messages'}
            </ul>
            <form onSubmit={handleSubmit}>
                <input ref={node => inputVal = node} placeholder="type here..." />
                <button>Submit</button>
            </form>
        </section>
        <Canvas />

        <Prompt when={props.isUserAdmin(props.user.id)}
            message={'Are you want to leave? This will close your room.'} />
    </div>);
};

const mapStateToProps = ({ global, rooms, chats, user, users }: State) => ({
    isSocketConnected: global.isSocketConnected,
    rooms,
    chats,
    users,
    user: user.userData
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    initRoomEnter: () => dispatch(actions.rooms.initRoomEnter()),
    initRoomLeave: () => dispatch(actions.rooms.initRoomLeave()),
    setCurrentRoom: (id: string) => dispatch(actions.rooms.setCurrentRoom(id)),
    setRoomUsers: (data: object) => dispatch(actions.users.setRoomUsers(data)),
    setMessages: (data: object) => dispatch(actions.chats.setMessages(data))
});

export const Room = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers(handlers),
    lifecycle<Props, {}>(hooks)
)(RoomComponent);
