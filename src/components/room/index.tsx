import { compose, lifecycle, withHandlers, withState } from "recompose";
import { connect } from "react-redux";
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import { State, Rooms, UserData, Chats, Users } from "../../store";
import { actions } from "../../actions";

import { RoomComponent } from "./template";

interface Params {
    id: string;
}

export interface Props extends RouteComponentProps<Params> {
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
        const roomId = props.match.params.id;

        if (!Object.keys(props.rooms.list).length) return false;

        const adminId = prevP ? prevP.rooms.list[roomId].adminId :
            props.rooms.list[roomId].adminId;

        return Number(itm) === Number(adminId);
    },
    handleBeforeUnload: (props: Props) => (e: BeforeUnloadEvent) => {
        const message = 'Are you sure?';
        e.returnValue = message;
        return message;
    },
    setMessage: (props: Props) => (e: any) => {
        props.setState(e.target.value);
    },
    handleSubmit: (props: Props) => (value: string) => {

        props.initSendRoomMessage({
            message: value,
            author: props.user.username,
            authorId: props.user.id,
            roomId: props.match.params.id
        });
    },
    changeRoomOwner: (props: Props) => (e: any) => {
        const roomId = props.match.params.id;
        const userId = e.target.dataset.id;

        props.initRoomAdminChange({ roomId, userId });
    }
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
