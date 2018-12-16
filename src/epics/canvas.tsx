import { Epic } from "redux-observable";
import {
  map,
  mergeMap,
  tap,
  ignoreElements,
  debounceTime,
  take,
  takeWhile,
  mapTo,
  pluck
} from "rxjs/operators";
import { of, from } from "rxjs";

import { fetchStreamService } from "../services/fetch.service";
import { Socket } from "../services/socket.service";

import { store } from "../store";

import { types } from "../actions/types";
import { actions } from "../actions";

const URL = "http://localhost:3001/";

export const drawingBroadcastEpic: Epic = (action$, state$) =>
  action$.ofType(types.SET_DRAWING_POINT).pipe(
    tap(v => {
      const roomId = state$.value.rooms.active;
      const drawingId = state$.value.canvas.currentDrawing;

      Socket!.emit(`${roomId}/draw`, { ...v.payload, drawingId });
    }),
    mapTo(actions.canvas.setDrawCount())
  );

export const createNewDrawingEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_CREATE_NEW_DRAWING).pipe(
    tap(v => {
      console.log("CREATED NEW DRAWING");
    }),
    mergeMap(action =>
      from(
        fetchStreamService(
          `${URL}users/${state$.value.user.userData.id}/drawings/`,
          "POST",
          {
            name: action.payload.name,
            userId: state$.value.user.userData.id
          }
        )
      )
    ),
    mergeMap(resp =>
      of(
        actions.canvas.setCurrentDrawing(resp.data.currentId),
        actions.user.setUserDrawings(resp.data.drawings)
      )
    )
  );

export const selectDrawingEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_DRAWING_SELECT).pipe(
    pluck("payload"),
    tap(v => {
      console.log("SELECTED DRAWING");
    }),
    map(id => actions.canvas.setCurrentDrawing(id))
  );

export const selectDrawingInRoom: Epic = (action$, state$) =>
  action$.ofType(types.INIT_IN_ROOM_DRAWING_SELECT).pipe(
    pluck("payload"),
    tap(drawingId => {
      const roomId = state$.value.rooms.active;

      store.dispatch(actions.canvas.clearDrawingPoints());
      store.dispatch(actions.canvas.setCurrentDrawing(drawingId));

      Socket!.emit(`${roomId}/draw/change`, { drawingId, roomId });
    }),
    ignoreElements()
  );

// export const drawingTakeIntoOwnershipOnMouseDownEpic: Epic = (action$, state$) => action$
//     .ofType(types.SET_DRAWING_POINT)
//     .pipe(
//         take(1),
//         takeWhile(() => true),
//         tap(v => {
//             console.log('ADDED TO MY PROFILE');
//         }),
//         mergeMap(action => from(fetchStreamService(
//             `${URL}rooms/${state$.value.rooms.active}/drawing/add`,
//             'POST',
//             { userId: state$.value.user.userData.id }
//         ))),
//         ignoreElements()
//     );

export const drawingBroadcastNewPointsGroupEpic: Epic = (action$, state$) =>
  action$.ofType(types.SET_NEW_DRAWING_POINTS_GROUP).pipe(
    tap(v => {
      const roomId = state$.value.rooms.active;
      const userId = state$.value.user.userData.id;

      Socket!.emit(`${roomId}/draw/newgroup`, userId);
    }),
    ignoreElements()
  );

export const drawingBroadcastMouseUpEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_MOUSE_UP_BROADCAST).pipe(
    tap(v => {
      const roomId = state$.value.rooms.active;
      const drawCount = state$.value.canvas.drawCount;

      Socket!.emit(`${roomId}/draw/mouseup`, drawCount);
      store.dispatch(actions.canvas.setDrawCount(0));
    }),
    ignoreElements()
  );

export const canvasImageSaveEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_CANVAS_TO_IMAGE).pipe(
    debounceTime(2500),
    tap(v => {
      console.log("RUN");
    }),
    mergeMap(action =>
      from(
        fetchStreamService(
          `${URL}rooms/${state$.value.rooms.active}/drawing/save/`,
          "POST",
          {
            image: action.payload,
            drawingId: state$.value.canvas.currentDrawing
          }
        )
      )
    ),
    ignoreElements()
  );

export const drawingResetEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_CLEAR_DRAWING_POINTS).pipe(
    tap(v => {
      const roomId = state$.value.rooms.active;
      const userId = state$.value.user.userData.id;
      const drawingId = state$.value.canvas.currentDrawing;

      Socket!.emit(`${roomId}/draw/reset`, { userId, drawingId });
    }),
    ignoreElements()
  );
