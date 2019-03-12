import { connect } from 'socket.io-client';
import { Epic } from 'redux-observable';
import {
  map,
  mergeMap,
  filter,
  mapTo,
  tap,
  ignoreElements,
  pluck,
} from 'rxjs/operators';
import { of } from 'rxjs';

import { State, UserData, DrawingPoint } from '../store/interfaces';
import { store } from '../store';

import { actions } from '../actions';
import { types } from '../actions/types';

import config from './../config';

export let socket: SocketIOClient.Socket;

export const startSocketEpic: Epic = (action$, state$) =>
  action$.ofType(types.GLOBAL_INIT_AUTH_SUCCESS).pipe(
    pluck<{}, UserData>('payload'),
    tap(data => {
      const { username, id, email } = data;

      socket = connect(
        config.API_URL,
        { query: `user=${username}&id=${id}` },
      );

      socket.on('connect', () => {
        store.dispatch(actions.socket.setSocketConnectionStatus(true));
        store.dispatch(actions.socket.bindHandlers());
      });
    }),
    ignoreElements(),
  );

export const closeSocketEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_CLOSE).pipe(
    tap(() => socket.close()),
    ignoreElements(),
  );

export const bindSocketHandlersEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_BIND_HANDLERS).pipe(
    tap(() => {
      const { id } = state$.value.user.userData;

      socket.on('disconnect', () => {
        store.dispatch(actions.socket.setSocketConnectionStatus(false));
      });

      socket.on(`${id}/connect`, ({ users, messages, rooms }: any) => {
        const messageData = {
          data: messages,
          channel: 'general',
        };

        store.dispatch(actions.rooms.setRooms(rooms));
        store.dispatch(actions.users.setUsers(users));
        store.dispatch(actions.chats.setMessages(messageData));
      });

      socket.on('general/users', (data: string[]) =>
        store.dispatch(actions.users.setUsers(data)),
      );

      socket.on('general/messages', (data: any) => {
        const payload = {
          data,
          channel: 'general',
        };

        store.dispatch(actions.chats.setMessages(payload));
      });

      socket.on('inbox/get', (data: any) => {
        console.log('fetched inbox');
        store.dispatch(actions.user.setInboxMessages(data));
      });

      socket.on('inbox/new', (data: any) => {
        store.dispatch(actions.user.setInboxMessages(data));
        console.log('received data inbox ', data);

        store.dispatch(actions.user.initReceiveInboxMessage());
      });

      socket.on('rooms/get', (data: any) => {
        store.dispatch(actions.rooms.setRooms(data));
      });

      socket.on('room/create', (id: string) => {
        console.log('ROOM CREATE GET');
        store.dispatch(actions.rooms.initHandleRoomCreate(id));
      });
    }),
    ignoreElements(),
  );

export const bindRoomHandlersEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.SOCKET_BIND_ROOM_HANDLERS).pipe(
    tap(() => {
      const roomId =
        state$.value.router.location.pathname.split('/')[2] ||
        state$.value.rooms.active;
      const drawingId = state$.value.canvas.currentDrawing;
      const userId = state$.value.user.userData.id;

      store.dispatch(actions.rooms.setCurrentRoom(roomId));

      socket.emit('room/join', { roomId, drawingId });

      socket.on(`${roomId}/setdrawing`, (drawingId: number) => {
        store.dispatch(actions.canvas.setCurrentDrawing(drawingId));
      });

      socket.on(`${roomId}/messages`, (data: any) => {
        store.dispatch(
          actions.chats.setMessages({
            data,
            channel: 'selectedRoom',
          }),
        );
      });

      socket.on(`${roomId}/draw`, (data: any) => {
        // TODO handle this
      });

      socket.on(`${roomId}/draw/getexisting`, (data: DrawingPoint[]) => {
        const drawingGroupCount = data
          .slice()
          .reverse()
          .find(p => p.userId === userId);

        store.dispatch(
          actions.canvas.setBroadcastedDrawingPointsBulk({ data, userId }),
        );

        if (drawingGroupCount) {
          store.dispatch(
            actions.canvas.setGroupCount(drawingGroupCount.group + 1),
          );
        }
      });

      socket.on(`${roomId}/draw/newgroup`, (userId: string) => {});

      socket.on(`${roomId}/draw/change`, (drawingId: string) => {
        store.dispatch(actions.canvas.setCurrentDrawing(drawingId));
      });
      // TODO
      socket.on(`${roomId}/draw/reset`, (userId: string) => {});

      socket.on(`${roomId}/users`, (data: any) => {
        store.dispatch(actions.users.setRoomUsers(data));
      });

      socket.on(`${roomId}/adminleaving`, () => {
        store.dispatch(actions.rooms.initRoomAdminLeave());
      });
    }),
    ignoreElements(),
  );

export const unbindSocketHandlersEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_UNBIND_ROOM_HANDLERS).pipe(
    tap(() => {
      const roomId = state$.value.rooms.active;

      socket.emit('room/leave', roomId);
      socket.off(`${roomId}/messages`);
      socket.off(`${roomId}/draw`);
      socket.off(`${roomId}/draw/getexisting`);
      socket.off(`${roomId}/draw/newgroup`);
      socket.off(`${roomId}/draw/reset`);
      socket.off(`${roomId}/adminleaving`);
    }),
    ignoreElements(),
  );
