import { Epic } from 'redux-observable';
import {
  map,
  filter,
  mergeMap,
  tap,
  ignoreElements,
  throttleTime,
  pluck,
  catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';
import flatMap from 'lodash/flatmap';

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
    tap(({ ctx }) => {
      const { width, height } = ctx.canvas;

      ctx.fillStyle = '#ffffff';
      ctx.clearRect(0, 0, width, height);
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
      console.log(ctx);
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
