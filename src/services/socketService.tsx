import { connect } from 'socket.io-client';

import { store, UserData } from '../store';
import { actions } from '../actions';

import config from './../../config';

export let Socket: SocketIOClient.Socket | undefined;

export const startSocketService = async (data: UserData): Promise<UserData> => {
  return new Promise(async (res, rej) => {
    const { username, id, email } = data;

    Socket = await connect(
      config.API_URL,
      { query: `user=${username}&id=${id}` },
    );

    Socket.on('general/users', (data: string[]) =>
      store.dispatch(actions.users.setUsers(data)),
    );

    Socket.on('general/messages', (data: any) => {
      const payload = {
        data,
        channel: 'general',
      };

      store.dispatch(actions.chats.setMessages(payload));
    });

    Socket.on('inbox/get', (data: any) => {
      console.log('fetched inbox');
      store.dispatch(actions.user.setInboxMessages(data));
    });

    Socket.on('inbox/new', (data: any) => {
      store.dispatch(actions.user.setInboxMessages(data));
      console.log('received data inbox ', data);

      store.dispatch(actions.user.initReceiveInboxMessage());
    });

    Socket.on('rooms/get', (data: any) => {
      store.dispatch(actions.rooms.setRooms(data));
    });

    Socket.on('room/create', (id: string) => {
      console.log('ROOM CREATE GET');
      store.dispatch(actions.rooms.initHandleRoomCreate(id));
    });

    Socket.on(`${id}/connect`, ({ users, messages, rooms }: any) => {
      const messageData = {
        data: messages,
        channel: 'general',
      };

      store.dispatch(actions.rooms.setRooms(rooms));
      store.dispatch(actions.users.setUsers(users));
      store.dispatch(actions.chats.setMessages(messageData));

      res(data);
    });

    Socket.on('connect', () => {
      console.log('CONNECTED!');
      store.dispatch(actions.global.setSocketConnectionStatus(true));
    });
  });
};
