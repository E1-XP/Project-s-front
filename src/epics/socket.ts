import { connect } from 'socket.io-client';
import { Epic } from 'redux-observable';
import { tap, ignoreElements, pluck, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { State, UserData, DrawingPoint } from '../store/interfaces';
import { store } from '../store';

import { actions } from '../actions';
import { types } from '../actions/types';

import config from './../config';

export let socket: SocketIOClient.Socket;

export const startSocketEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.GLOBAL_INIT_AUTH_SUCCESS).pipe(
    pluck<{}, UserData>('payload'),
    tap(data => {
      const { username, id, email } = data;

      socket = connect(config.API_URL, { query: `user=${username}&id=${id}` });

      socket.on('connect', () => {
        store.dispatch(actions.socket.setSocketConnectionStatus(true));
        store.dispatch(actions.socket.bindHandlers());
      });

      socket.on('reconnect', () => {
        const { pathname } = state$.value.router.location;
        const isOnRoomRoute = /^\/room\/\d+$/.test(pathname);

        isOnRoomRoute && store.dispatch(actions.socket.reconnectInRoom());
      });
    }),
    ignoreElements(),
  );

export const closeSocketEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_CLOSE).pipe(
    tap(() => socket.close()),
    ignoreElements(),
  );

export const bindSocketHandlersEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
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

      socket.on(`general/messages/write`, (authorId: string) => {
        const isOnDashboardPage = state$.value.router.location.pathname
          .toLowerCase()
          .startsWith('/dashboard');

        if (isOnDashboardPage) {
          store.dispatch(
            actions.chats.handleWriteMessageBroadcast(authorId, 'general'),
          );
        }
      });

      socket.on('inbox/get', (data: any) => {
        store.dispatch(actions.user.setInboxMessages(data));
      });

      socket.on('inbox/new', (data: any) => {
        store.dispatch(actions.user.setInboxMessages(data));
        store.dispatch(actions.user.initReceiveInboxMessage());
      });

      socket.on('rooms/get', (data: any) => {
        store.dispatch(actions.rooms.setRooms(data));
      });

      socket.on('room/create', (id: string) => {
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

      socket.on(`${roomId}/messages/write`, (authorId: string) => {
        store.dispatch(
          actions.chats.handleWriteMessageBroadcast(authorId, roomId),
        );
      });

      socket.on(`${roomId}/draw`, (data: DrawingPoint) => {
        store.dispatch(actions.canvas.setBroadcastedDrawingPoint(data));
      });

      socket.on(`${roomId}/mouseup`, (userId: number) => {
        const drawingId = store.getState().canvas.currentDrawing;
        store.dispatch(actions.user.incrDrawingVersion(drawingId));
      });

      socket.on(`${roomId}/drawgroupcheck`, (data: string) => {
        const [userIdStr, drawingIdStr, groupStr, tstamps] = data.split('|');
        const test = tstamps.split('.').map(str => Number(str));

        const currGroup = state$.value.canvas.broadcastedDrawingPoints[
          userIdStr
        ].find(arr => arr && !!arr.length && arr[0].group === Number(groupStr));

        const groupIsIncorrectOrNotExist =
          !currGroup || currGroup.some((p, i) => p.date !== test[i]);
        if (groupIsIncorrectOrNotExist) {
          // get correct data and replace
          socket.emit(`${roomId}/sendcorrectgroup`, data);
        }
      });

      socket.on(`${roomId}/sendcorrectgroup`, (correctG: DrawingPoint[]) => {
        store.dispatch(
          actions.canvas.setBroadcastedDrawingPointsGroup(correctG),
        );
      });

      socket.on(`${roomId}/resendcorrectdrawdata`, (groupInfo: number[]) => {
        const [userId, drawingId, group] = groupInfo;

        const userPoints = state$.value.canvas.broadcastedDrawingPoints[userId];
        const correctGroup = userPoints
          ? userPoints.find(
              arr => arr && !!arr.length && arr[0].group === group,
            )
          : undefined;

        socket.emit(`${roomId}/resendcorrectdrawdata`, correctGroup);
      });

      socket.on(`${roomId}/draw/getexisting`, (data: DrawingPoint[]) => {
        const latestUserPoint = data
          .slice()
          .reverse()
          .find(p => p.userId === userId);

        store.dispatch(
          actions.canvas.setBroadcastedDrawingPointsBulk({ data, userId }),
        );

        if (latestUserPoint) {
          store.dispatch(
            actions.canvas.setGroupCount(latestUserPoint.group + 1),
          );
        }
      });

      socket.on(`${roomId}/draw/change`, (drawingId: string) => {
        store.dispatch(actions.canvas.clearDrawingPoints());
        store.dispatch(actions.canvas.setCurrentDrawing(drawingId));
      });

      socket.on(`${roomId}/draw/reset`, (userId: string) => {
        store.dispatch(actions.canvas.clearDrawingPoints());
        store.dispatch(actions.canvas.setGroupCount(0));
      });

      socket.on(`${roomId}/users`, (data: any) => {
        store.dispatch(actions.users.setRoomUsers(data));
      });

      socket.on(`${roomId}/adminleaving`, () => {
        store.dispatch(actions.rooms.initRoomAdminLeave());
      });
    }),
    ignoreElements(),
  );

export const unbindSocketRoomHandlersEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_UNBIND_ROOM_HANDLERS).pipe(
    tap(() => {
      const roomId = state$.value.rooms.active;

      socket.emit('room/leave', roomId);
      socket.off(`${roomId}/setdrawing`);
      socket.off(`${roomId}/messages`);
      socket.off(`${roomId}/messages/write`);
      socket.off(`${roomId}/draw`);
      socket.off(`${roomId}/mouseup`);
      socket.off(`${roomId}/drawgroupcheck`);
      socket.off(`${roomId}/sendcorrectgroup`);
      socket.off(`${roomId}/resendcorrectdrawdata`);
      socket.off(`${roomId}/draw/getexisting`);
      socket.off(`${roomId}/draw/change`);
      socket.off(`${roomId}/draw/reset`);
      socket.off(`${roomId}/users`);
      socket.off(`${roomId}/adminleaving`);
    }),
    ignoreElements(),
  );

export const reconnectInRoomEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.SOCKET_RECONNECT_IN_ROOM).pipe(
    tap(() => console.log('reconnecting')),
    mergeMap(() =>
      of(
        actions.socket.unbindRoomHandlers(),
        actions.socket.bindRoomHandlers(),
        actions.canvas.initGetImagesFromServer(),
      ),
    ),
  );
