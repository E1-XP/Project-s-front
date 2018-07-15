import { Epic, combineEpics } from "redux-observable";
import {
    map, flatMap, switchMap, catchError, mergeMap, tap,
    ignoreElements, take, delay, share
} from "rxjs/operators";
import { of, from } from "rxjs";
import { push } from "connected-react-router";

import { fetchStreamService } from '../services/fetch.service';
import { startSocketService, Socket } from "../services/socket.service";

import { store } from "../store";

import { types } from "../actions/types";
import { actions } from "../actions";

const URL = 'http://localhost:3001/auth/';

const appStartEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_APP)
    .pipe(
        map(v => localStorage.getItem('isAuth') ?
            actions.global.initSessionAuth() :
            actions.global.setIsLoading(false)
        )
    );

const authEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_AUTHENTICATION)
    .pipe(
        mergeMap(action =>
            from(fetchStreamService(
                `${URL}${state$.value.router.location.pathname.toLowerCase().slice(1)}`,
                'POST',
                state$.value.global.formState
            )).pipe(
                catchError(err => of(actions.global.networkError(err))),
                tap(v => localStorage.setItem('isAuth', 'true')),
                mergeMap(v => from(startSocketService(v))),
                mergeMap(v => of(
                    actions.global.setIsUserLoggedIn(true),
                    push('/dashboard'),
                    actions.user.setUserData(v.data)
                ))
            )
        )
    );

const sessionAuthEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_SESSION_AUTH)
    .pipe(
        mergeMap(action =>
            from(fetchStreamService(
                `${URL}${'sessionauth'}`,
                'POST'
            )).pipe(
                catchError(err => {
                    console.log(err, 'ERROR DATA');
                    return of(actions.global.networkError(err));
                }),
                mergeMap(v => from(startSocketService(v))),
                mergeMap(resp => of(
                    actions.user.setUserData(resp.data),
                    actions.global.setIsUserLoggedIn(true),
                    actions.global.setIsLoading(false),
                ))
            )
        )
    );

const roomEnterEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_ROOM_ENTER)
    .pipe(
        map(() => state$.value.router.location.pathname.split('/')[2]),
        tap(id => {
            console.log(id, 'onEnter ');
            store.dispatch(actions.rooms.setCurrentRoom(id));

            Socket.emit('room/join', id);

            Socket.on(`${id}/messages`, (data: any) => store
                .dispatch(actions.chats.setMessages({
                    channel: 'selectedRoom',
                    data
                })));

            Socket.on(`${id}/users`, (data: any) => store
                .dispatch(actions.users.setRoomUsers(data)));
        }),
        ignoreElements()
    );

const roomLeaveEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_ROOM_LEAVE)
    .pipe(
        tap(v => {
            const id = state$.value.rooms.active;
            Socket.emit('room/leave', id);
            Socket.off(`${id}/messages`);
        }),
        mergeMap(v => of(
            actions.rooms.setCurrentRoom(null),
            actions.users.setRoomUsers({}),
            actions.chats.setMessages({
                channel: 'selectedRoom',
                data: {}
            })
        ))
    );

const logoutEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_LOGOUT)
    .pipe(
        tap(v => {
            Socket.close();
            console.log('WILL DISCONNECT YOU')
            localStorage.removeItem('isAuth');
        }),
        mergeMap(action =>
            from(fetchStreamService(
                `${URL}${'logout'}`,
                'POST'
            )).pipe(
                mergeMap(resp => of(
                    actions.user.setUserData(null),
                    actions.global.setIsUserLoggedIn(false),
                    push("/login")
                ))
            )
        )
    );

export const rootEpic = combineEpics(
    appStartEpic,
    authEpic,
    sessionAuthEpic,
    roomEnterEpic,
    roomLeaveEpic,
    logoutEpic
);
