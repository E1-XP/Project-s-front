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

import { InvitationData } from '../components/canvas/toolbar';
import { State } from '../store/interfaces';

import { actions } from '../actions';
import { types } from '../actions/types';

import { socket } from './socket';

export const emitRoomDrawEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_DRAW).pipe(
    pluck('payload'),
    tap(data => {
      const roomId = state$.value.rooms.active;
      socket.emit(`${roomId}/draw`, data);
    }),
    ignoreElements(),
  );

export const emitRoomDrawChangeEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_DRAW_CHANGE).pipe(
    pluck('payload'),
    tap(data => {
      const roomId = state$.value.rooms.active;
      socket.emit(`${roomId}/draw/change`, data);
    }),
    ignoreElements(),
  );

export const emitRoomDrawMouseUpEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_DRAW_MOUSEUP).pipe(
    pluck('payload'),
    tap(data => {
      const roomId = state$.value.rooms.active;
      socket.emit(`${roomId}/draw/mouseup`, data);
    }),
    ignoreElements(),
  );

export const emitRoomDrawReconnectEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_DRAW_RECONNECT).pipe(
    pluck('payload'),
    tap(offlinePoints => {
      const roomId = state$.value.rooms.active;
      socket.emit(`${roomId}/draw/reconnect`, offlinePoints);
    }),
    ignoreElements(),
  );

export const emitRoomDrawResetEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_DRAW_RESET).pipe(
    pluck('payload'),
    tap(data => {
      const roomId = state$.value.rooms.active;
      socket.emit(`${roomId}/draw/reset`, data);
    }),
    ignoreElements(),
  );

export const emitRoomSetAdminEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_SET_ADMIN).pipe(
    pluck('payload'),
    tap(data => {
      const roomId = state$.value.rooms.active;
      socket.emit(`${roomId}/setadmin`, data);
    }),
    ignoreElements(),
  );

export const emitRoomCreateEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_CREATE).pipe(
    pluck('payload'),
    tap(data => socket.emit(`room/create`, data)),
    ignoreElements(),
  );

export const emitGeneralMessageEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_GENERAL_MESSAGE).pipe(
    pluck('payload'),
    tap(data => {
      socket.emit(`general/messages`, data);
    }),
    ignoreElements(),
  );

export const emitMessageWriteEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_MESSAGE_WRITE).pipe(
    pluck<{}, string>('payload'),
    tap(channel => {
      socket.emit(`${channel}/messages/write`, channel);
    }),
    ignoreElements(),
  );

export const emitInboxMessageEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_INBOX_MESSAGE).pipe(
    pluck<{}, InvitationData>('payload'),
    tap(data => {
      socket.emit(`${data.senderId}/inbox`, data);
    }),
    ignoreElements(),
  );

export const emitRoomMessageEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_MESSAGE).pipe(
    pluck<{}, InvitationData>('payload'),
    tap(data => {
      const roomId = state$.value.rooms.active;
      socket.emit(`${roomId}/messages`, data);
    }),
    ignoreElements(),
  );
