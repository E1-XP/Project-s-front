import { Epic } from "redux-observable";
import { map, mergeMap, tap, ignoreElements } from "rxjs/operators";
import { of } from "rxjs";

import { fetchStreamService } from '../services/fetch.service';
import { Socket } from "../services/socket.service";

import { store } from "../store";

import { types } from "../actions/types";
import { actions } from "../actions";

export const roomJoinEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_ROOM_ENTER)
    .pipe(
        map(v => state$.value.router.location.pathname.split('/')[2]),
        tap(roomId => {
            store.dispatch(actions.rooms.setCurrentRoom(roomId));

            Socket.emit('room/join', roomId);

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
        ignoreElements()
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
            actions.chats.setMessages({
                channel: 'selectedRoom',
                data: {}
            })
        ))
    );

export const drawingBroadcastEpic: Epic = (action$, state$) => action$
    .ofType(types.SET_DRAWING_POINT)
    .pipe(
        tap(v => {
            const roomId = state$.value.rooms.active;
            Socket.emit(`${roomId}/draw`, v.payload);
        }),
        ignoreElements()
    );

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

            Socket.emit(`${roomId}/draw/mouseup`);
        }),
        ignoreElements()
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
