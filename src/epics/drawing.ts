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
import { of } from 'rxjs';

import { DrawingPoint, State } from './../store/interfaces';
import { store } from '../store';

import { types } from '../actions/types';
import { actions } from '../actions';

export const createDrawingPointEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_CREATE_DRAWING_POINT).pipe(
    map(({ event, boardRef, onMouseDownMode }) => {
      const { id } = state$.value.user.userData;
      const { groupCount, fill, weight } = state$.value.canvas;

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
        user: opts.user || id,
      });

      if (onMouseDownMode) {
        return [pointFactory(), pointFactory({ x: xPos + 3, y: yPos + 3 })];
      }

      return [pointFactory()];
    }),
    mergeMap(data => of(...data.map(p => actions.canvas.setDrawingPoint(p)))),
  );

export const clearCanvasEpic: Epic = (action$, state$) =>
  action$.ofType(types.CANVAS_CLEAR).pipe(
    tap(({ ctx, ref }) => {
      const { width, height } = ref;

      ctx.fillStyle = '#ffffff';
      ctx.clearRect(0, 0, width, height);
    }),
    ignoreElements(),
  );

export const drawCanvasEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.CANVAS_DRAW).pipe(
    pluck<{}, CanvasRenderingContext2D>('payload'),
    tap(ctx => {
      ctx.lineJoin = 'round';

      const toDraw = state$.value.canvas.drawingPoints;

      toDraw.forEach(arr =>
        arr.forEach((point, i, arr) => {
          const { x, y, fill, weight } = point;

          i &&
            requestAnimationFrame(() => {
              ctx.strokeStyle = fill;
              ctx.lineWidth = weight;

              ctx.beginPath();
              ctx.lineTo(arr[i - 1].x, arr[i - 1].y);
              ctx.lineTo(x, y);
              ctx.stroke();
            });
        }),
      );
    }),
    ignoreElements(),
  );
