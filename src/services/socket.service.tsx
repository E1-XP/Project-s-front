import io from "socket.io-client";

import { store } from "../store"
import { actions } from '../actions'

const URL = 'http://localhost:3001';

export let Socket: SocketIOClient.Socket | null;

export const startSocketService = async (v: any): Promise<any> => {
    console.log(v, 'received by socketInit')
    // if (!data.payload.email || !data.payload.email.length) return null;

    Socket = await io(URL,
        { query: `user=${v.data.username}&id=${v.data.id}` });

    Socket.on('general/users', (data: string[]) =>
        store.dispatch(actions.users.setUsers(data)));

    Socket.on('general/messages', (data: any) => {
        console.log('ON');
        store.dispatch(actions.chats.setMessages({
            channel: 'general',
            data
        }));
    });

    Socket.on('rooms/get', (data: any) =>
        store.dispatch(actions.rooms.setRooms(data)));

    console.log('SOCKET STARTED');
    store.dispatch(actions.global.setSocketConnectionStatus(true));

    return new Promise((res, rej) => setTimeout(() => res(v), 500));
};
