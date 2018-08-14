import React, { ComponentType } from 'react';
import { compose, lifecycle, withHandlers, withState } from "recompose";
import { connect } from "react-redux";
import { RouteComponentProps, Prompt } from 'react-router-dom';
import { Dispatch } from 'redux';

import { State, Rooms, UserData, Chats, Users } from "../../store";
import { actions } from "../../actions";

import { Canvas } from "./canvas";

interface Params {
    id: string;
}

interface Props extends RouteComponentProps<Params> {
    state: string;
    rooms: Rooms;
    chats: Chats;
    user: UserData;
    users: Users;
    isSocketConnected: boolean;
    isUserAdmin: (itm: string | number, prevProps?: Props) => boolean;
    handleBeforeUnload: (e: BeforeUnloadEvent) => void;
    changeRoomOwner: () => void;
    initSendRoomMessage: (data: any) => Dispatch;
    handleSubmit: () => void;
    setState: (v: any) => void;
    initRoomAdminChange: (data: any) => Dispatch;
    setMessage: (e: any) => void;
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
    },
    componentDidUpdate(prevP: Props) {
        const { isUserAdmin, user, handleBeforeUnload } = this.props;
        const isRoomListAvailable = Object.keys(prevP.rooms.list).length;

        if (isRoomListAvailable && !isUserAdmin(prevP.user.id, prevP) && isUserAdmin(user.id)) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }
        else if (isRoomListAvailable && isUserAdmin(prevP.user.id, prevP) && !isUserAdmin(user.id)) {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }
};

export const handlers = {
    isUserAdmin: (props: Props) => (itm: string | number, prevP?: Props) => {
        if (!Object.keys(props.rooms.list).length) return false;

        const adminId = prevP ? prevP.rooms.list[props.match.params.id].adminId :
            props.rooms.list[props.match.params.id].adminId;

        if (typeof itm === 'string') itm = Number(itm);

        return itm === Number(adminId);
    },
    handleBeforeUnload: (props: Props) => (e: BeforeUnloadEvent) => {
        const message = 'Are you sure?';
        e.returnValue = message;
        return message;
    },
    setMessage: (props: Props) => (e: any) => {
        props.setState(e.target.value);
    },
    handleSubmit: (props: Props) => (e: any) => {
        e.preventDefault();

        props.initSendRoomMessage({
            message: props.state,
            author: props.user.username,
            roomId: props.match.params.id
        })
    },
    changeRoomOwner: (props: Props) => (e: any) => {
        const roomId = props.match.params.id;
        const userId = e.target.dataset.id;

        props.initRoomAdminChange({ roomId, userId });
    }
};

export const RoomComponent: ComponentType<Props> = (props) => {
    const { changeRoomOwner, isUserAdmin, handleSubmit, setMessage, user, users, state } = props;
    const { selectedRoom } = props.chats;

    const isLoaded = props.isSocketConnected && Object.keys(props.rooms.list).length &&
        props.match.params.id;

    if (!isLoaded) return <p>loading...</p>;

    return (<div>
        <section style={{ float: 'left' }}>
            <h1>room {props.rooms.list[props.match.params.id].name}</h1>
            <h2>currently online</h2>
            <ul>
                {Object.keys(users.selectedRoom).length ?
                    Object.keys(users.selectedRoom).map((id, i) =>
                        <li
                            style={{ color: isUserAdmin(Number(id)) ? '#f32' : '#fff' }} key={id}>
                            {users.selectedRoom[id]}
                            {isUserAdmin(user.id) && !isUserAdmin(Number(id)) &&
                                <span data-id={id}
                                    onClick={changeRoomOwner}>*Set as admin</span>}
                        </li>) :
                    'no users'}
            </ul>
            <ul>
                {selectedRoom.length ?
                    selectedRoom.map((itm, i) =>
                        <li key={i}>
                            {selectedRoom[i].message}-{selectedRoom[i].author}
                        </li>) :
                    'no messages'}
            </ul>
            <form onSubmit={handleSubmit}>
                <input value={state} onChange={setMessage} placeholder="type here..." />
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
    setMessages: (data: object) => dispatch(actions.chats.setMessages(data)),
    initSendRoomMessage: (data: any) => dispatch(actions.chats.initSendRoomMesssage(data)),
    initRoomAdminChange: (data: any) => dispatch(actions.rooms.initRoomAdminChange(data))
});

export const Room = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withState('state', 'setState', ''),
    withHandlers(handlers),
    lifecycle<Props, {}>(hooks)
)(RoomComponent);
