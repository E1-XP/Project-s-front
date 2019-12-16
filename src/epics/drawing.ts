import { Epic } from 'redux-observable';
import {
  map,
  mapTo,
  filter,
  mergeMap,
  tap,
  ignoreElements,
  pluck,
  reduce,
  take,
  takeWhile,
  throttleTime,
} from 'rxjs/operators';
import { of, animationFrameScheduler, combineLatest } from 'rxjs';
import identity from 'lodash/identity';

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
    map(({ event, boardRef }) => {
      const { id: userId } = state$.value.user.userData;
      const {
        groupCount: group,
        fill,
        weight,
        currentDrawing: drawingId,
      } = state$.value.canvas;

      const { pageX, pageY } = event;
      const { scrollX, scrollY } = window;

      const { top, left, width, height } = boardRef.getBoundingClientRect();

      const x = ((pageX - left - scrollX) / width) * boardRef.width;
      const y = ((pageY - top - scrollY) / height) * boardRef.height;

      return {
        x,
        y,
        fill,
        weight,
        date: Date.now(),
        group,
        userId,
        drawingId: Number(drawingId),
      };
    }),
    mergeMap(point =>
      of(
        actions.canvas.setDrawingPoint(point),
        actions.socket.emitRoomDraw(point),
      ),
    ),
  );

export const clearCanvasEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_CLEAR).pipe(
    tap(({ ctx }) => {
      const { width, height } = ctx.canvas;

      ctx.clearRect(0, 0, width, height);
    }),
    ignoreElements(),
  );

export const initRedrawCanvasEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.CANVAS_REDRAW).pipe(
    throttleTime(0, animationFrameScheduler, { trailing: true }),
    pluck('ctx'),
    mergeMap(ctx =>
      of(actions.canvas.clearCanvas(ctx), actions.canvas.initDrawCanvas(ctx)),
    ),
  );

export const initRedrawBackCanvasEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
  action$.ofType(types.CANVAS_REDRAW_BACK).pipe(
    throttleTime(0, animationFrameScheduler, { trailing: true }),
    pluck('ctx'),
    mergeMap(ctx =>
      of(
        actions.canvas.clearCanvas(ctx),
        actions.canvas.initDrawCanvas(ctx, true),
      ),
    ),
  );

export const initDrawCanvasEpic: Epic<any, any, State> = (action$, state$) =>
  action$
    .ofType(types.CANVAS_INIT_DRAW)
    .pipe(
      map(({ ctx, isDrawingOnBack }) =>
        isDrawingOnBack
          ? actions.canvas.drawCanvas(
              ctx,
              state$.value.canvas.drawingPointsCache,
            )
          : actions.canvas.getDrawingPoints(ctx),
      ),
    );

export const getDrawingPointsEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.CANVAS_GET_DRAWING_POINTS).pipe(
    map(({ ctx }) => {
      const cacheLen = state$.value.canvas.drawingPointsCache.length;
      const combined = getCombinedDrawingPoints(state$.value);

      // set cache and return points over cache length
      const maxMainCanvasGroups = 3;
      const divide = (val: number) => Math.floor(val / maxMainCanvasGroups);

      const isNewCacheLengthDifferent =
        divide(cacheLen) !== divide(combined.length);

      if (isNewCacheLengthDifferent) {
        const newCacheLen =
          combined.length - (combined.length % maxMainCanvasGroups);
        const newCache = combined.slice(0, newCacheLen);

        store.dispatch(actions.canvas.setDrawingPointsCache(newCache));

        return [ctx, combined.slice(newCacheLen)];
      }

      return [ctx, cacheLen ? combined.slice(cacheLen - 1) : combined];
    }),
    map(payload => actions.canvas.drawCanvas(...payload)),
  );

export const drawCanvasEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.CANVAS_DRAW).pipe(
    tap<{ ctx: CanvasRenderingContext2D; toDraw: DrawingPoint[][] }>(
      ({ ctx, toDraw }) => {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        toDraw.forEach(group => {
          const { fill, weight } = group[0];

          ctx.strokeStyle = fill;
          ctx.fillStyle = fill;
          ctx.lineWidth = weight;

          group.forEach(({ x, y }, i) => {
            if (group.length === 1) {
              ctx.beginPath();
              ctx.arc(x, y, weight / 2, 0, 2 * Math.PI);
              ctx.fill();
              ctx.closePath();
            } else if (i < group.length - 1) {
              if (i === 0) {
                ctx.beginPath();
                ctx.moveTo(x, y);
              }

              const prevP = i > 0 ? group[i - 1] : group[0];
              const nextP = group[i + 1];
              const next2P = i !== group.length - 2 ? group[i + 2] : nextP;

              const cp1x = x + (nextP.x - prevP.x) / 6;
              const cp1y = y + (nextP.y - prevP.y) / 6;

              const cp2x = nextP.x - (next2P.x - x) / 6;
              const cp2y = nextP.y - (next2P.y - y) / 6;

              ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nextP.x, nextP.y);
            } else if (i === group.length - 1) ctx.stroke();
          });
        });
      },
    ),
    ignoreElements(),
  );

export const collectUserDPointsWhenOfflineEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
  combineLatest([
    action$.ofType(types.CANVAS_CREATE_DRAWING_POINT),
    action$
      .ofType(types.SOCKET_SET_CONNECTION_STATUS)
      .pipe(filter(identity), take(1)),
  ]).pipe(
    // action$.ofType(types.CANVAS_CREATE_DRAWING_POINT).pipe(
    //   filter(() => !state$.value.global.isSocketConnected),
    //   pluck('payload'),
    //   // fires when this happens
    //   takeWhile(
    //     action$.ofType(types.SOCKET_SET_CONNECTION_STATUS).pipe(filter(identity)),
    //   ),
    map(([v1, v2]) => v1),
    pluck('payload'),
    reduce<DrawingPoint, DrawingPoint[]>((acc, point) => [...acc, point], []),
    tap(v => console.log('collected data', v)),
    map(offlinePoints => actions.socket.emitRoomDrawReconnect(offlinePoints)),
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
    map(actions.socket.emitRoomDrawMouseup),
  );
