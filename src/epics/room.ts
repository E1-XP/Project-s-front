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
import { of, iif, EMPTY, merge } from 'rxjs';
import { push } from 'connected-react-router';

import { fetchStream } from '../utils/fetchStream';

import { store } from '../store';

import { types } from '../actions/types';
import { actions } from '../actions';

import config from './../config';

import {
  isRoomLinkParamIncludedInLastRoute,
  isRoomPasswordCheckedAndValid,
} from './helpers';

export const roomJoinEpic: Epic = (action$, state$) =>
  action$.ofType(types.ROOMS_INIT_ENTER).pipe(
    delay(100),
    map(v => {
      const roomId = state$.value.router.location.pathname.split('/')[2];
      const userId = state$.value.user.userData.id;

      const isRoomUndefined = !state$.value.rooms.list[roomId];
      if (isRoomUndefined) return false;

      const isRoomPrivate = state$.value.rooms.list[roomId].isPrivate;
      const isUserAdmin = state$.value.rooms.list[roomId].adminId === userId;

      return isRoomPrivate && !isUserAdmin;
    }),
    mergeMap(shouldEnterPassword =>
      iif(
        () => shouldEnterPassword,
        of(
          push(
            `/room/${
              state$.value.router.location.pathname.split('/')[2]
            }/password`,
          ),
          actions.global.setIsLoading(false),
        ),
        of(actions.rooms.initRoomEnterSuccess()),
      ),
    ),
  );

export const checkRoomPasswordEpic: Epic = (action$, state$) =>
  action$.ofType(types.ROOMS_CHECK_PASSWORD).pipe(
    pluck<any, any>('payload'),
    mergeMap(password =>
      fetchStream(
        `${config.API_URL}/rooms/${
          state$.value.router.location.pathname.split('/')[2]
        }/checkpassword`,
        'POST',
        { password },
      ).pipe(
        tap(resp =>
          isRoomPasswordCheckedAndValid.next(
            resp.status === 200 ? true : false,
          ),
        ),
        mergeMap(resp =>
          iif(
            () => resp.status === 200,
            of(
              actions.global.setIsLoading(true),
              push(
                `/room/${state$.value.router.location.pathname.split('/')[2]}`,
              ),
              actions.rooms.initRoomEnterSuccess(),
            ),
            of(actions.rooms.initCheckRoomPasswordFailure()),
          ),
        ),
        catchError(err => of(actions.global.networkError(err))),
      ),
    ),
  );

export const checkRoomPasswordFailureEpic: Epic = (action$, state$) =>
  action$.ofType(types.ROOMS_CHECK_PASSWORD_FAILURE).pipe(
    tap(v => isRoomPasswordCheckedAndValid.next(null)),
    mapTo(actions.global.setFormMessage('provided password is incorrect')),
  );

export const handleRoomEnterSuccessEpic: Epic = (action$, state$) =>
  action$
    .ofType(types.ROOMS_INIT_ENTER_SUCCESS)
    .pipe(
      mergeMap(v =>
        of(
          actions.socket.bindRoomHandlers(),
          actions.canvas.initGetImagesFromServer(),
        ),
      ),
    );

export const concludeRoomEnterEpic: Epic = (action$, state$) =>
  action$.ofType(types.ROOMS_INIT_ENTER_SUCCESS).pipe(
    concatMap(
      v =>
        action$
          .ofType(types.CANVAS_SET_BROADCASTED_DRAWING_POINTS_BULK)
          .pipe(take(1)),
      v => actions.global.setIsLoading(false),
    ),
    tap(v => {
      isRoomLinkParamIncludedInLastRoute.value &&
        isRoomLinkParamIncludedInLastRoute.next(false);
      typeof isRoomPasswordCheckedAndValid.value === 'boolean' &&
        isRoomPasswordCheckedAndValid.next(null);
    }),
  );

export const roomLeaveEpic: Epic = (action$, state$) =>
  action$.ofType(types.ROOMS_INIT_LEAVE).pipe(
    mergeMap(v =>
      of(
        actions.socket.unbindRoomHandlers(),
        actions.global.setIsLoading(true),
        actions.rooms.setCurrentRoom(null),
        actions.users.setRoomUsers({}),
        // actions.canvas.clearDrawingPoints(),
        actions.canvas.setCurrentDrawing(null),
        actions.chats.setMessages({
          channel: 'selectedRoom',
          data: {},
        }),
      ),
    ),
  );

export const handleLoadingOnRoomLeave: Epic = (action$, state$) =>
  action$.ofType(types.ROOMS_INIT_LEAVE).pipe(
    filter(
      v =>
        state$.value.global.isUserLoggedIn &&
        !isRoomLinkParamIncludedInLastRoute.value,
    ),
    delay(350),
    mapTo(actions.global.setIsLoading(false)),
  );

export const roomAdminLeaveEpic: Epic = (action$, state$) =>
  action$.ofType(types.ROOMS_INIT_ADMIN_LEAVE).pipe(
    tap(v => {
      alert(
        'Admin closed this room. You will be redirected back to dashboard.',
      );
    }),
    mapTo(push('/dashboard')),
  );

export const handleSendRoomMessageEpic: Epic = (action$, state$) =>
  action$.ofType(types.ROOMS_SEND_MESSAGE).pipe(
    pluck('payload'),
    map((data: any) => {
      const { message, author, authorId } = data;
      return actions.socket.emitRoomMessage({ message, author, authorId });
    }),
  );

export const setRoomAdminEpic: Epic = (action$, state$) =>
  action$.ofType(types.ROOMS_INIT_ADMIN_CHANGE).pipe(
    pluck('payload'),
    map((data: any) => actions.socket.emitRoomSetAdmin(data)),
  );

export const RoomCreateEpic: Epic = (action$, state$) =>
  action$.ofType(types.ROOMS_INIT_CREATE).pipe(
    pluck('payload'),
    mergeMap(data => {
      const drawingId = state$.value.canvas.currentDrawing;

      return of(
        actions.socket.emitRoomCreate({ ...data, drawingId }),
        actions.global.setIsLoading(true),
      );
    }),
  );

export const handleRoomCreateEpic: Epic = (action$, state$) =>
  action$.ofType(types.ROOMS_HANDLE_CREATE).pipe(
    pluck('payload'),
    mergeMap(roomId =>
      of(actions.rooms.setCurrentRoom(roomId), push(`/room/${roomId}`)),
    ),
  );

export const getUserImagesEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_GET_IMAGES_FROM_SERVER).pipe(
    mergeMap(action =>
      fetchStream(
        `${config.API_URL}/users/${state$.value.user.userData.id}/drawings/`,
      ),
    ),
    map(resp => actions.user.setUserDrawings(resp.data.drawings)),
    catchError(err => of(actions.global.networkError(err))),
  );
