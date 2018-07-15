import React from 'react';
import { compose, lifecycle } from "recompose";
import { connect } from "react-redux";
import { BrowserRouterProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import { State } from "../../store";
import { actions } from "../../actions";
import { Socket } from '../../services/socket.service';

import { Canvas } from "../canvas";

interface Props {
    math: BrowserRouterProps;
    isSocketConnected: boolean;
}

const lifecycleMethods = {
    componentDidMount() {
        this.props.initRoomEnter();

    },
    componentWillUnmount() {
        this.props.initRoomLeave();
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

    if (!props.isSocketConnected) return <p>loading...</p>;

    return (<div>
        <section style={{ float: 'left' }}>
            <h1>room {props.rooms.list[props.match.params.id]}</h1>
            <h2>currently online</h2>
            <ul>
                {Object.keys(props.users.selectedRoom).length ?
                    Object.keys(props.users.selectedRoom).map((itm, i) =>
                        <li key={i}>{props.users.selectedRoom[itm]}</li>) :
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
            <nav>
                <button>back</button>
                <button>next</button>
            </nav>
        </section>
        <Canvas />
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
    lifecycle<Props, {}>(lifecycleMethods)
)(RoomComponent);
