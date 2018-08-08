import { Epic } from "redux-observable";
import {
    map, mergeMap, tap, ignoreElements, debounceTime, take, takeWhile,
    mapTo, pluck
} from "rxjs/operators";
import { of, from } from "rxjs";
import { push } from "connected-react-router";

import { fetchStreamService } from '../services/fetch.service';
import { Socket } from "../services/socket.service";

import { store } from "../store";

import { types } from "../actions/types";
import { actions } from "../actions";

const URL = 'http://localhost:3001/';

export const roomJoinEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_ROOM_ENTER)
    .pipe(
        tap(action => {
            const roomId = state$.value.router.location.pathname.split('/')[2] ||
                state$.value.rooms.active;
            const drawingId = state$.value.canvas.currentDrawing;

            store.dispatch(actions.rooms.setCurrentRoom(roomId));

            Socket.emit('room/join', { roomId, drawingId });

            Socket.on(`${roomId}/messages`, (data: any) => store
                .dispatch(actions.chats.setMessages({
                    channel: 'selectedRoom',
                    data
                }))
            );

            Socket.on(`${roomId}/draw`, (data: any) => {
                store.dispatch(actions.canvas.setBroadcastedDrawingPoint(data));
            });

            Socket.on(`${roomId}/draw/getexisting`, (data: any[]) => {
                store.dispatch(actions.canvas.setBroadcastedDrawingPointsBulk(data));
            });

            Socket.on(`${roomId}/draw/newgroup`, (userId: string) => {
                store.dispatch(actions.canvas.setNewBroadcastedDrawingPointsGroup(userId))
            });

            Socket.on(`${roomId}/draw/reset`, (userId: string) => {
                store.dispatch(actions.canvas.clearDrawingPoints())
            });

            Socket.on(`${roomId}/users`, (data: any) => {
                // store.dispatch(actions.global.setIsLoading(false));
                store.dispatch(actions.users.setRoomUsers(data));
            });
        }),
        mapTo(actions.canvas.initGetImagesFromServer())
    );

export const roomLeaveEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_ROOM_LEAVE)
    .pipe(
        tap(v => {
            const roomId = state$.value.rooms.active;

            Socket.emit('room/leave', roomId);
            Socket.off(`${roomId}/messages`);
            Socket.off(`${roomId}/draw`);
            Socket.off(`${roomId}/draw/getexisting`);
            Socket.off(`${roomId}/draw/newgroup`);
            Socket.off(`${roomId}/draw/reset`);
        }),
        mergeMap(v => of(
            actions.rooms.setCurrentRoom(null),
            actions.users.setRoomUsers({}),
            actions.canvas.clearDrawingPoints(),
            actions.canvas.setCurrentDrawing(null),
            actions.chats.setMessages({
                channel: 'selectedRoom',
                data: {}
            })
        ))
    );

export const handleRoomCreateEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_HANDLE_ROOM_CREATE)
    .pipe(
        map(action => action.payload),
        mergeMap(roomId => of(
            actions.rooms.setCurrentRoom(roomId),
            push(`/room/${roomId}`),
            actions.global.setIsLoading(false)
        ))
    );

export const drawingBroadcastEpic: Epic = (action$, state$) => action$
    .ofType(types.SET_DRAWING_POINT)
    .pipe(
        tap(v => {
            const roomId = state$.value.rooms.active;
            const drawingId = state$.value.canvas.currentDrawing;

            Socket.emit(`${roomId}/draw`, { ...v.payload, drawingId });
        }),
        mapTo(actions.canvas.setDrawCount())
    );

export const createNewDrawingEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_CREATE_NEW_DRAWING)
    .pipe(
        tap(v => {
            console.log('CREATED NEW DRAWING');
        }),
        mergeMap(action => from(fetchStreamService(
            `${URL}users/${state$.value.user.userData.id}/drawings/`,
            'POST',
            {
                name: action.payload.name,
                userId: state$.value.user.userData.id
            }
        ))),
        mergeMap(resp => of(
            actions.canvas.setCurrentDrawing(resp.data.currentId),
            actions.user.setUserDrawings(resp.data.drawings)
        ))
    );

export const selectDrawingEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_DRAWING_SELECT)
    .pipe(
        pluck('payload'),
        tap(v => {
            console.log('SELECTED DRAWING');
        }),
        map(id => actions.canvas.setCurrentDrawing(id))
    );

export const selectDrawingInRoom: Epic = (action$, state$) => action$
    .ofType(types.INIT_IN_ROOM_DRAWING_SELECT)
    .pipe(
        pluck('payload'),
        tap(drawingId => {
            const roomId = state$.value.rooms.active;

            store.dispatch(actions.canvas.clearDrawingPoints());
            store.dispatch(actions.canvas.setCurrentDrawing(drawingId));

            Socket.emit(`${roomId}/draw/change`, { drawingId, roomId });
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

export const drawingBroadcastNewPointsGroupEpic: Epic = (action$, state$) => action$
    .ofType(types.SET_NEW_DRAWING_POINTS_GROUP)
    .pipe(
        tap(v => {
            const roomId = state$.value.rooms.active;
            const userId = state$.value.user.userData.id;

            Socket.emit(`${roomId}/draw/newgroup`, userId);
        }),
        ignoreElements()
    );

export const drawingBroadcastMouseUpEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_MOUSE_UP_BROADCAST)
    .pipe(
        tap(v => {
            const roomId = state$.value.rooms.active;
            const drawCount = state$.value.canvas.drawCount;

            Socket.emit(`${roomId}/draw/mouseup`, drawCount);
            store.dispatch(actions.canvas.setDrawCount(0));
        }),
        ignoreElements()
    );

export const canvasImageSaveEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_CANVAS_TO_IMAGE)
    .pipe(
        debounceTime(2500),
        tap(v => { console.log('RUN') }),
        mergeMap(action => from(fetchStreamService(
            `${URL}rooms/${state$.value.rooms.active}/drawing/save/`,
            'POST',
            {
                image: action.payload,
                drawingId: state$.value.canvas.currentDrawing
            }
        ))),
        ignoreElements()
    );

export const getUserImagesEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_GET_IMAGES_FROM_SERVER)
    .pipe(
        tap(v => { console.log('GOT YOUR DRAWINGS') }),
        mergeMap(action => from(fetchStreamService(
            `${URL}users/${state$.value.user.userData.id}/drawings/`,
            'GET'
        ))),
        map(resp => actions.user.setUserDrawings(resp.data.drawings))
    );

export const drawingResetEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_CLEAR_DRAWING_POINTS)
    .pipe(
        tap(v => {
            const roomId = state$.value.rooms.active;
            const userId = state$.value.user.userData.id;

            Socket.emit(`${roomId}/draw/reset`, userId);
        }),
        ignoreElements()
    );
