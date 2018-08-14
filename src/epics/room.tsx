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

            Socket.on(`${roomId}/setdrawing`, (drawingId: number) => {
                store.dispatch(actions.canvas.setCurrentDrawing(drawingId));
            });

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

            Socket.on(`${roomId}/draw/change`, (drawingId: string) => {
                store.dispatch(actions.canvas.setCurrentDrawing(drawingId));
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

export const handleSendRoomMessageEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_SEND_ROOM_MESSAGE)
    .pipe(
        pluck('payload'),
        tap((data: any) => {
            const { message, author, roomId } = data;
            Socket.emit(`${roomId}/messages`, { message, author });
        }),
        ignoreElements()
    );

export const setRoomAdminEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_ROOM_ADMIN_CHANGE)
    .pipe(
        pluck('payload'),
        tap((data: any) => {
            const { roomId } = data;
            Socket.emit(`${roomId}/setadmin`, data);
        }),
        ignoreElements()
    );

export const RoomCreateEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_ROOM_CREATE)
    .pipe(
        pluck('payload'),
        tap(data => {
            const drawingId = state$.value.canvas.currentDrawing;
            Socket.emit('room/create', { ...data, drawingId });
        }),
        mapTo(actions.global.setIsLoading(true))
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
