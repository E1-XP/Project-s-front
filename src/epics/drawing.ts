import { Epic } from 'redux-observable';
import {
  map,
  mapTo,
  filter,
  mergeMap,
  tap,
  ignoreElements,
  throttleTime,
  pluck,
  take,
} from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import flatMap from 'lodash/flatmap';
import { LOCATION_CHANGE } from 'connected-react-router';

import { DrawingPoint, State } from './../store/interfaces';
import { store } from '../store';

import { types } from '../actions/types';
import { actions } from '../actions';

import { getCombinedDrawingPoints } from './../selectors/getCombinedDrawingPoints';

export const createDrawingPointEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
  action$.ofType(types.CANVAS_CREATE_DRAWING_POINT).pipe(
    map(({ event, boardRef, onMouseDownMode }) => {
      const { id } = state$.value.user.userData;
      const {
        groupCount,
        fill,
        weight,
        currentDrawing: drawingId,
      } = state$.value.canvas;

      const { pageX, pageY } = event;
      const { scrollX, scrollY } = window;

      const { top, left, width, height } = boardRef.getBoundingClientRect();

      const xPos = ((pageX - left - scrollX) / width) * boardRef.width;
      const yPos = ((pageY - top - scrollY) / height) * boardRef.height;

      const pointFactory = (opts: Partial<DrawingPoint> = {}) => ({
        x: opts.x !== undefined ? opts.x : xPos,
        y: opts.y !== undefined ? opts.y : yPos,
        fill: opts.fill || fill,
        weight: opts.weight || weight,
        date: opts.date || Date.now(),
        group: opts.group !== undefined ? opts.group : groupCount,
        userId: opts.userId !== undefined ? opts.userId : id,
        drawingId:
          opts.drawingId !== undefined ? opts.drawingId : Number(drawingId),
      });

      if (onMouseDownMode) {
        return [
          pointFactory(),
          pointFactory({ x: xPos + weight, y: yPos + weight }),
        ];
      }

      return [pointFactory()];
    }),
    mergeMap(data =>
      of(
        ...flatMap(data, p => [
          actions.canvas.setDrawingPoint(p),
          actions.socket.emitRoomDraw(p),
        ]),
      ),
    ),
  );

export const clearCanvasEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_CLEAR).pipe(
    // throttleTime(1000 / 60, undefined, { trailing: true }),
    tap(({ ctx }) => {
      const { width, height } = ctx.canvas;

      ctx.fillStyle = '#ffffff';
      ctx.clearRect(0, 0, width, height);
      ctx.fillRect(0, 0, width, height);
    }),
    ignoreElements(),
  );

export const drawCanvasEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.CANVAS_DRAW).pipe(
    // throttleTime(1000 / 60, undefined, { trailing: true }),
    map(({ ctx, isDrawingOnBack }) => {
      const toDraw = !isDrawingOnBack
        ? getCombinedDrawingPoints(state$.value)
        : state$.value.canvas.drawingPointsCache;

      return { ctx, toDraw };
    }),
    tap(({ ctx, toDraw }) => {
      ctx.lineJoin = 'round';

      toDraw.forEach(arr =>
        arr.forEach((point, i, arr) => {
          const { x, y, fill, weight } = point;

          if (i) {
            ctx.strokeStyle = fill;
            ctx.lineWidth = weight;

            ctx.beginPath();
            ctx.lineTo(arr[i - 1].x, arr[i - 1].y);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
        }),
      );
    }),
    ignoreElements(),
  );

export const drawMouseUpEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.CANVAS_SET_IS_MOUSE_DOWN).pipe(
    pluck('payload'),
    filter(value => value === false),
    map(() => {
      const userId = state$.value.user.userData.id;
      const {
        currentDrawing: drawingId,
        groupCount: group,
      } = state$.value.canvas;

      const points = state$.value.canvas.drawingPoints.find(
        arr => arr && !!arr.length && arr[0].group === group,
      );

      const tstamps = points ? points.map(p => p.date).join('.') : '';

      return [userId, drawingId, group, tstamps].join('|');
    }),
    map(data => actions.socket.emitRoomDrawMouseup(data)),
  );

export const galleryRouteEpic: Epic = (action$, state$) =>
  action$.ofType(LOCATION_CHANGE).pipe(
    filter(
      ({ payload }) =>
        payload.location.pathname.toLowerCase().startsWith('/gallery') &&
        state$.value.user.userData.id !== null,
    ),
    mergeMap(() =>
      of(
        actions.global.setIsLoading(true),
        actions.canvas.initGetImagesFromServer(),
      ),
    ),
  );

export const galleryRouteInstantEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
  combineLatest([
    action$
      .ofType(LOCATION_CHANGE)
      .pipe(
        filter(
          ({ payload }) =>
            payload.location.pathname.toLowerCase().startsWith('/gallery') &&
            !state$.value.global.isUserLoggedIn,
        ),
      ),
    action$.ofType(types.USER_SET_USER_DATA).pipe(take(1)),
    action$.ofType(types.ROOMS_SET).pipe(take(1)),
    action$.ofType(types.GLOBAL_SET_IS_USER_LOGGED_IN).pipe(take(1)),
  ]).pipe(mapTo(actions.canvas.initGetImagesFromServer()));

export const galleryRouteEnterEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.CANVAS_SET_USER_DRAWINGS).pipe(
    filter(() =>
      state$.value.router.location.pathname
        .toLowerCase()
        .startsWith('/gallery'),
    ),
    mapTo(actions.global.setIsLoading(false)),
  );
