import { Epic } from 'redux-observable';
import {
  map,
  mergeMap,
  tap,
  ignoreElements,
  debounceTime,
  take,
  takeWhile,
  mapTo,
  pluck,
  catchError,
} from 'rxjs/operators';
import { of, from, iif } from 'rxjs';
import { push } from 'connected-react-router';

import { fetchStreamService } from '../services/fetchService';
import { Socket } from '../services/socketService';

import { store } from '../store';

import { types } from '../actions/types';
import { actions } from '../actions';

import config from './../../config';
import { resolvePtr } from 'dns';

export const roomJoinEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_ROOM_ENTER).pipe(
    map(v => {
      const roomId = state$.value.router.location.pathname.split('/')[2];
      const userId = state$.value.user.userData.id;
      let password = null;

      const isRoomPrivate = state$.value.rooms.list[roomId].isPrivate;
      const isUserAdmin = state$.value.rooms.list[roomId].adminId === userId;

      if (isRoomPrivate && !isUserAdmin) {
        password = prompt('enter password:') || '';
      }

      return { password, roomId };
    }),
    mergeMap((data: any) =>
      iif(
        () => data.password === null,
        of(actions.rooms.initRoomEnterSuccess()),
        of(actions.rooms.initCheckRoomPassword(data)),
      ),
    ),
  );

export const checkRoomPasswordEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_CHECK_ROOM_PASSWORD).pipe(
    pluck<any, any>('payload'),
    mergeMap((roomId, password) =>
      fetchStreamService(
        `${config.API_URL}/rooms/${roomId}/checkpassword`,
        'POST',
        { password },
      ).pipe(
        mergeMap(resp =>
          iif(
            () => resp.status === 200,
            of(actions.rooms.initRoomEnterSuccess()),
            of(actions.rooms.initCheckRoomPasswordFailure()),
          ),
        ),
        catchError(err => of(actions.global.networkError(err))),
      ),
    ),
  );

export const checkRoomPasswordFailureEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_CHECK_ROOM_PASSWORD_FAILURE).pipe(
    tap(v => {
      alert('Incorrect password. Please try again.');
    }),
    mapTo(push('/dashboard')),
  );

export const handleRoomEnterSuccessEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_ROOM_ENTER_SUCCESS).pipe(
    tap(action => {
      const roomId =
        state$.value.router.location.pathname.split('/')[2] ||
        state$.value.rooms.active;
      const drawingId = state$.value.canvas.currentDrawing;

      store.dispatch(actions.rooms.setCurrentRoom(roomId));

      Socket!.emit('room/join', { roomId, drawingId });

      Socket!.on(`${roomId}/setdrawing`, (drawingId: number) => {
        store.dispatch(actions.canvas.setCurrentDrawing(drawingId));
      });

      Socket!.on(`${roomId}/messages`, (data: any) =>
        store.dispatch(
          actions.chats.setMessages({
            data,
            channel: 'selectedRoom',
          }),
        ),
      );

      Socket!.on(`${roomId}/draw`, (data: any) => {
        store.dispatch(actions.canvas.setBroadcastedDrawingPoint(data));
      });

      Socket!.on(`${roomId}/draw/getexisting`, (data: any[]) => {
        store.dispatch(actions.canvas.setBroadcastedDrawingPointsBulk(data));
      });

      Socket!.on(`${roomId}/draw/newgroup`, (userId: string) => {
        store.dispatch(
          actions.canvas.setNewBroadcastedDrawingPointsGroup(userId),
        );
      });

      Socket!.on(`${roomId}/draw/change`, (drawingId: string) => {
        store.dispatch(actions.canvas.setCurrentDrawing(drawingId));
      });

      Socket!.on(`${roomId}/draw/reset`, (userId: string) => {
        store.dispatch(actions.canvas.clearDrawingPoints());
      });

      Socket!.on(`${roomId}/users`, (data: any) => {
        // store.dispatch(actions.global.setIsLoading(false));
        store.dispatch(actions.users.setRoomUsers(data));
      });

      Socket!.on(`${roomId}/adminleaving`, () => {
        store.dispatch(actions.rooms.initRoomAdminLeave());
      });
    }),
    mapTo(actions.canvas.initGetImagesFromServer()),
  );

export const roomLeaveEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_ROOM_LEAVE).pipe(
    tap(v => {
      const roomId = state$.value.rooms.active;

      Socket!.emit('room/leave', roomId);
      Socket!.off(`${roomId}/messages`);
      Socket!.off(`${roomId}/draw`);
      Socket!.off(`${roomId}/draw/getexisting`);
      Socket!.off(`${roomId}/draw/newgroup`);
      Socket!.off(`${roomId}/draw/reset`);
      Socket!.off(`${roomId}/adminleaving`);
    }),
    mergeMap(v =>
      of(
        actions.rooms.setCurrentRoom(null),
        actions.users.setRoomUsers({}),
        actions.canvas.clearDrawingPoints(),
        actions.canvas.setCurrentDrawing(null),
        actions.chats.setMessages({
          channel: 'selectedRoom',
          data: {},
        }),
      ),
    ),
  );

export const roomAdminLeaveEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_ROOM_ADMIN_LEAVE).pipe(
    tap(v => {
      alert(
        'Admin closed this room. You will be redirected back to dashboard.',
      );
    }),
    mapTo(push('/dashboard')),
  );

export const handleSendRoomMessageEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_SEND_ROOM_MESSAGE).pipe(
    pluck('payload'),
    tap((data: any) => {
      const { message, author, authorId, roomId } = data;
      Socket!.emit(`${roomId}/messages`, { message, author, authorId });
    }),
    ignoreElements(),
  );

export const setRoomAdminEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_ROOM_ADMIN_CHANGE).pipe(
    pluck('payload'),
    tap((data: any) => {
      const { roomId } = data;
      Socket!.emit(`${roomId}/setadmin`, data);
    }),
    ignoreElements(),
  );

export const RoomCreateEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_ROOM_CREATE).pipe(
    pluck('payload'),
    tap(data => {
      const drawingId = state$.value.canvas.currentDrawing;
      Socket!.emit('room/create', { ...data, drawingId });
    }),
    // mapTo(actions.global.setIsLoading(true))
    ignoreElements(),
  );

export const handleRoomCreateEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_HANDLE_ROOM_CREATE).pipe(
    map(action => action.payload),
    mergeMap(roomId =>
      of(
        actions.rooms.setCurrentRoom(roomId),
        push(`/room/${roomId}`),
        // actions.global.setIsLoading(false)
      ),
    ),
  );

export const getUserImagesEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_GET_IMAGES_FROM_SERVER).pipe(
    tap(v => {
      console.log('GOT YOUR DRAWINGS');
    }),
    mergeMap(action =>
      fetchStreamService(
        `${config.API_URL}/users/${state$.value.user.userData.id}/drawings/`,
        'GET',
      ),
    ),
    map(resp => actions.user.setUserDrawings(resp.data.drawings)),
    catchError(err => of(actions.global.networkError(err))),
  );
