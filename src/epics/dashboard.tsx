import { Epic } from "redux-observable";
import {
    map, mergeMap, tap, ignoreElements, debounceTime, take, takeWhile,
    mapTo, pluck
} from "rxjs/operators";
import { of, from, iif } from "rxjs";
import { push } from "connected-react-router";

import { fetchStreamService } from '../services/fetch.service';
import { Socket } from "../services/socket.service";

import { store } from "../store";

import { types } from "../actions/types";
import { actions } from "../actions";

const URL = 'http://localhost:3001';

export const handleSendGeneralMessageEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_SEND_GENERAL_MESSAGE)
    .pipe(
        pluck('payload'),
        tap(data => {
            Socket.emit('general/messages', data);
        }),
        ignoreElements()
    );

export const handleRoomClickEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_ROOM_LIST_CLICK)
    .pipe(
        tap(v => {
            console.log(v);
        }),
        pluck('payload'),
        mergeMap((data: any) => iif(
            () => data.password === null,
            of(actions.rooms.initRoomListClickSuccess(data.id)),
            of(actions.rooms.initCheckRoomPassword(data))
        ))
    );

export const checkRoomPasswordEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_CHECK_ROOM_PASSWORD)
    .pipe(
        pluck('payload'),
        mergeMap(({ id, password }) => from(fetchStreamService(
            `${URL}/rooms/${id}/checkpassword`,
            'POST',
            { password }
        )).pipe(
            map(response => ({ response, id }))
        )),
        mergeMap(data => iif(
            () => data.response.status === 200,
            of(actions.rooms.initRoomListClickSuccess(data.id)),
            of(actions.rooms.initCheckRoomPasswordFailure())
        ))
    );

export const checkRoomPasswordFailureEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_CHECK_ROOM_PASSWORD_FAILURE)
    .pipe(
        tap(v => {
            alert('Incorrect password. Please try again.');
        }),
        ignoreElements()
    );

export const handleRoomClickSuccessEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_ROOM_LIST_CLICK_SUCCESS)
    .pipe(
        tap(v => { console.log(v, 'CHECK THIS') }),
        pluck('payload'),
        map(id => push(`/room/${id}`))
    );
