import { Epic } from 'redux-observable';
import {
  map,
  mergeMap,
  filter,
  tap,
  ignoreElements,
  debounceTime,
  take,
  mapTo,
  pluck,
  concatMap,
  catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';

import { fetch$ } from '../utils/fetchStream';

import { store } from '../store';
import { State, DrawingObject, DrawingPoint } from '../store/interfaces';

import { types } from '../actions/types';
import { actions } from '../actions';

import config from './../config';

import { currentDrawingOnRoomEnter$ } from './helpers';

export const createNewDrawingEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_INIT_CREATE_NEW_DRAWING).pipe(
    mergeMap(action =>
      fetch$(
        `${config.API_URL}/users/${state$.value.user.userData.id}/drawings/`,
        'POST',
        { name: action.payload.name, userId: state$.value.user.userData.id },
      ).pipe(
        mergeMap(resp =>
          of(
            actions.canvas.setCurrentDrawing(resp.data.currentId),
            actions.user.setUserDrawings(resp.data.drawings),
          ),
        ),
        catchError(err => of(actions.global.networkError(err))),
      ),
    ),
  );

export const selectDrawingEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_INIT_DRAWING_SELECT).pipe(
    pluck('payload'),
    map(id => actions.canvas.setCurrentDrawing(id)),
  );

export const selectDrawingInRoomEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_INIT_IN_ROOM_DRAWING_SELECT).pipe(
    pluck('payload'),
    map(drawingId => Number(drawingId)),
    map(drawingId => {
      const roomId = state$.value.rooms.active;

      store.dispatch(actions.canvas.clearDrawingPoints());
      store.dispatch(actions.canvas.setCurrentDrawing(drawingId));

      return actions.socket.emitRoomDrawChange({ drawingId, roomId });
    }),
  );

// handle after room enter, until admin chage img
export const drawingTakeIntoOwnershipOnMouseDownOnEnterEpic: Epic<
  any,
  any,
  State
> = (action$, state$) =>
  action$.ofType(types.ROOMS_INIT_ENTER_SUCCESS).pipe(
    concatMap(() =>
      action$.ofType(types.CANVAS_SET_DRAWING_POINT).pipe(
        take(1),
        pluck<{}, DrawingPoint>('payload'),
        filter(() => {
          const isFetching = state$.value.global.isFetching;
          const userDrawings = state$.value.user.drawings;
          const currentDrawing = state$.value.canvas.currentDrawing;
          const drawingIdOnRoomEnter = currentDrawingOnRoomEnter$.value;
          const hasDrawingChanged = drawingIdOnRoomEnter !== currentDrawing;

          if (!userDrawings || isFetching || hasDrawingChanged) return false;
          return (
            userDrawings.find(itm => itm.id === currentDrawing) === undefined
          );
        }),
      ),
    ),
    mergeMap(({ drawingId, userId }) =>
      fetch$(`${config.API_URL}/drawings/${drawingId}/addowner`, 'POST', {
        userId,
      }).pipe(
        map(resp => actions.user.setUserDrawings(resp.data)),
        catchError(err => of(actions.global.networkError(err))),
      ),
    ),
  );

export const setCurrentDrawingOnRoomEnterHelperEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
  action$.ofType(types.ROOMS_INIT_ENTER_SUCCESS).pipe(
    concatMap(() =>
      action$.ofType(types.CANVAS_SET_CURRENT_DRAWING).pipe(take(1)),
    ),
    tap(v =>
      currentDrawingOnRoomEnter$.next(state$.value.canvas.currentDrawing),
    ),
    ignoreElements(),
  );

export const setCurrentDrawingOnEnterrAfterChangeHelperEpic: Epic<
  any,
  any,
  State
> = (action$, state$) =>
  action$.ofType(types.CANVAS_SET_CURRENT_DRAWING).pipe(
    filter(
      () =>
        !state$.value.global.isLoading &&
        !!state$.value.rooms.active &&
        currentDrawingOnRoomEnter$.value !== null,
    ),
    tap(() => currentDrawingOnRoomEnter$.next(null)),
    ignoreElements(),
  );

// handle after in room img change
export const drawingTakeIntoOwnershipOnMouseDownEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
  action$.ofType(types.CANVAS_SET_CURRENT_DRAWING).pipe(
    filter(({ payload: drawingId }) => {
      const userDrawings = state$.value.user.drawings;

      return (
        !!userDrawings &&
        userDrawings.find(itm => itm.id === drawingId) === undefined
      );
    }),
    concatMap(() =>
      action$.ofType(types.CANVAS_SET_DRAWING_POINT).pipe(
        take(1),
        filter(() => !state$.value.global.isFetching),
        pluck<{}, DrawingPoint>('payload'),
      ),
    ),
    filter(({ drawingId }) => {
      const userDrawings = state$.value.user.drawings;
      const isRoomActive = !!state$.value.rooms.active;
      const isDrawingSame = currentDrawingOnRoomEnter$.value !== null;

      if (!userDrawings) return false;
      return (
        isRoomActive &&
        !isDrawingSame &&
        userDrawings.find(itm => itm.id === drawingId) === undefined
      );
    }),
    mergeMap(({ drawingId, userId }) =>
      fetch$(`${config.API_URL}/drawings/${drawingId}/addowner`, 'POST', {
        userId,
      }).pipe(
        map(resp => actions.user.setUserDrawings(resp.data)),
        catchError(err => of(actions.global.networkError(err))),
      ),
    ),
  );

export const canvasImageSaveEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.CANVAS_INIT_CANVAS_TO_IMAGE).pipe(
    debounceTime(700),
    map(({ boardRef, backBoardRef }) => {
      const combinedDrawing = document.createElement('canvas');
      combinedDrawing.width = 1280;
      combinedDrawing.height = 720;

      const ctx = combinedDrawing.getContext('2d');
      ctx!.fillStyle = '#ffffff';

      ctx!.fillRect(0, 0, combinedDrawing.width, combinedDrawing.height);
      ctx!.drawImage(backBoardRef, 0, 0);
      ctx!.drawImage(boardRef, 0, 0);

      return combinedDrawing.toDataURL('image/jpeg', 0.5);
    }),
    mergeMap(image =>
      fetch$(
        `${config.API_URL}/drawings/${state$.value.canvas.currentDrawing}/save`,
        'POST',
        { image },
      ).pipe(
        map(() => {
          const { currentDrawing } = state$.value.canvas;

          const incrVersion = (itm: DrawingObject) =>
            itm.id === currentDrawing!
              ? { ...itm, version: itm.version + 1 }
              : itm;

          const data = state$.value.user.drawings!.map(incrVersion);

          return actions.user.setUserDrawings(data);
        }),
        catchError(err => of(actions.global.networkError(err))),
      ),
    ),
  );

export const drawingResetEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_RESET_DRAWING).pipe(
    map(v => {
      const userId = state$.value.user.userData.id;
      const drawingId = state$.value.canvas.currentDrawing;

      return actions.socket.emitRoomDrawReset({ userId, drawingId });
    }),
  );
