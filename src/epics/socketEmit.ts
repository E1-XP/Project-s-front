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

import { InvitationData } from '../components/canvas/toolbar';

import { actions } from '../actions';
import { types } from '../actions/types';

import { socket } from './socket';

export const emitRoomDrawEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_DRAW).pipe(
    pluck('payload'),
    tap(data => {
      const roomId = state$.value.rooms.active;
      socket.emit(`${roomId}/draw`);
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

export const emitRoomDrawNewGroupEpic: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_DRAW_NEWGROUP).pipe(
    pluck('payload'),
    tap(data => {
      const roomId = state$.value.rooms.active;
      socket.emit(`${roomId}/draw/newgroup`, data);
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

export const emitRoomSetAdmin: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_SET_ADMIN).pipe(
    pluck('payload'),
    tap(data => {
      const roomId = state$.value.rooms.active;
      socket.emit(`${roomId}/setadmin`, data);
    }),
    ignoreElements(),
  );

export const emitRoomCreate: Epic = (action$, state$) =>
  action$.ofType(types.SOCKET_EMIT_ROOM_CREATE).pipe(
    pluck('payload'),
    tap(data => socket.emit(`room/setadmin`, data)),
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
