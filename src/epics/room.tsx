import { Epic } from 'redux-observable';
import {
  map,
  mergeMap,
  tap,
  ignoreElements,
  take,
  takeWhile,
  mapTo,
  pluck,
  delay,
  catchError,
  filter,
  concatMap,
} from 'rxjs/operators';
import {
  of,
  iif,
  EMPTY,
  combineLatest,
  zip,
  concat,
  BehaviorSubject,
} from 'rxjs';
import { push, LOCATION_CHANGE } from 'connected-react-router';
import queryString from 'query-string';

import { fetchStreamService } from '../services/fetchService';
import { Socket } from '../services/socketService';

import { store } from '../store';

import { types } from '../actions/types';
import { actions } from '../actions';

import config from './../../config';

const isRoomLinkParamIncludedInLastRoute = new BehaviorSubject(false);

export const routeContainsRoomLinkParam: Epic = (action$, state$) =>
  action$.ofType(LOCATION_CHANGE).pipe(
    pluck<any, any>('payload'),
    filter(
      payload =>
        state$.value.router.location.search.includes('link') &&
        /^room\/\d+$/.test(
          queryString
            .parse(state$.value.router.location.search)
            .link!.toString(),
        ),
    ),
    tap(() => isRoomLinkParamIncludedInLastRoute.next(true)),
    ignoreElements(),
  );

export const roomRouteEpic: Epic = (action$, state$) =>
  action$.ofType(LOCATION_CHANGE).pipe(
    pluck<any, any>('payload'),
    filter(
      payload =>
        /^\/room\/\d+$/.test(payload.location.pathname) &&
        state$.value.global.isUserLoggedIn &&
        state$.value.rooms.list[payload.location.pathname.split('/')[2]],
    ),
    mergeMap(payload =>
      of(actions.global.setIsLoading(true), actions.rooms.initRoomEnter()),
    ),
  );

export const handleRoomRouteInstantEnterEpic: Epic = (action$, state$) =>
  combineLatest([
    action$
      .ofType(LOCATION_CHANGE)
      .pipe(
        filter(
          ({ payload }) =>
            !state$.value.global.isUserLoggedIn &&
            /^\/room\/\d+$/.test(payload.location.pathname) &&
            isRoomLinkParamIncludedInLastRoute.value,
        ),
      ),
    action$.ofType(types.SET_USER_DATA).pipe(take(1)),
    action$.ofType(types.SET_ROOMS).pipe(take(1)),
    action$.ofType(types.SET_IS_USER_LOGGED_IN).pipe(take(1)),
  ]).pipe(
    map(arr =>
      arr[2].payload[state$.value.router.location.pathname.split('/')[2]]
        ? actions.rooms.initRoomEnter()
        : actions.global.setIsLoading(false),
    ),
  );

export const roomJoinEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_ROOM_ENTER).pipe(
    delay(100),
    map(v => {
      const roomId = state$.value.router.location.pathname.split('/')[2];
      const userId = state$.value.user.userData.id;
      let password = null;

      const isRoomUndefined = !state$.value.rooms.list[roomId];
      if (isRoomUndefined) return { password, roomId };

      const isRoomPrivate = state$.value.rooms.list[roomId].isPrivate;
      const isUserAdmin = state$.value.rooms.list[roomId].adminId === userId;

      if (isRoomPrivate && !isUserAdmin) {
        password = prompt('enter password:') || '';
      }

      return { password, roomId };
    }),
    mergeMap(data =>
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

      if (!Socket) return;

      Socket.emit('room/join', { roomId, drawingId });

      Socket.on(`${roomId}/setdrawing`, (drawingId: number) => {
        store.dispatch(actions.canvas.setCurrentDrawing(drawingId));
      });

      Socket.on(`${roomId}/messages`, (data: any) => {
        store.dispatch(
          actions.chats.setMessages({
            data,
            channel: 'selectedRoom',
          }),
        );
      });

      Socket.on(`${roomId}/draw`, (data: any) => {
        store.dispatch(actions.canvas.setBroadcastedDrawingPoint(data));
      });

      Socket.on(`${roomId}/draw/getexisting`, (data: any[]) => {
        store.dispatch(actions.canvas.setBroadcastedDrawingPointsBulk(data));
      });

      Socket.on(`${roomId}/draw/newgroup`, (userId: string) => {
        store.dispatch(
          actions.canvas.setNewBroadcastedDrawingPointsGroup(userId),
        );
      });

      Socket.on(`${roomId}/draw/change`, (drawingId: string) => {
        store.dispatch(actions.canvas.setCurrentDrawing(drawingId));
      });

      Socket.on(`${roomId}/draw/reset`, (userId: string) => {
        store.dispatch(actions.canvas.clearDrawingPoints());
      });

      Socket.on(`${roomId}/users`, (data: any) => {
        store.dispatch(actions.users.setRoomUsers(data));
      });

      Socket.on(`${roomId}/adminleaving`, () => {
        store.dispatch(actions.rooms.initRoomAdminLeave());
      });
    }),
    mergeMap(v => of(actions.canvas.initGetImagesFromServer())),
  );

export const concludeRoomEnterEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_ROOM_ENTER_SUCCESS).pipe(
    concatMap(
      v =>
        action$.ofType(types.SET_BROADCASTED_DRAWING_POINTS_BULK).pipe(take(1)),
      v => actions.global.setIsLoading(false),
    ),
    tap(
      v =>
        isRoomLinkParamIncludedInLastRoute.value &&
        isRoomLinkParamIncludedInLastRoute.next(false),
    ),
  );

export const roomLeaveEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_ROOM_LEAVE).pipe(
    tap(v => {
      const roomId = state$.value.rooms.active;

      if (!Socket) return;

      Socket.emit('room/leave', roomId);
      Socket.off(`${roomId}/messages`);
      Socket.off(`${roomId}/draw`);
      Socket.off(`${roomId}/draw/getexisting`);
      Socket.off(`${roomId}/draw/newgroup`);
      Socket.off(`${roomId}/draw/reset`);
      Socket.off(`${roomId}/adminleaving`);
    }),
    mergeMap(v =>
      of(
        actions.global.setIsLoading(true),
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

export const handleLoadingOnRoomLeave: Epic = (action$, state$) =>
  action$.ofType(types.INIT_ROOM_LEAVE).pipe(
    filter(
      v =>
        state$.value.global.isUserLoggedIn &&
        !isRoomLinkParamIncludedInLastRoute.value,
    ),
    delay(350),
    mapTo(actions.global.setIsLoading(false)),
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
    mapTo(actions.global.setIsLoading(true)),
  );

export const handleRoomCreateEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_HANDLE_ROOM_CREATE).pipe(
    pluck('payload'),
    mergeMap(roomId =>
      of(actions.rooms.setCurrentRoom(roomId), push(`/room/${roomId}`)),
    ),
  );

export const getUserImagesEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_GET_IMAGES_FROM_SERVER).pipe(
    mergeMap(action =>
      fetchStreamService(
        `${config.API_URL}/users/${state$.value.user.userData.id}/drawings/`,
      ),
    ),
    map(resp => actions.user.setUserDrawings(resp.data.drawings)),
    catchError(err => of(actions.global.networkError(err))),
  );
