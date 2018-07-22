import { Epic } from "redux-observable";
import { map, mapTo, catchError, mergeMap, tap, ignoreElements } from "rxjs/operators";
import { of, from } from "rxjs";
import { push } from "connected-react-router";

import { fetchStreamService } from '../services/fetch.service';
import { startSocketService, Socket } from "../services/socket.service";

import { store } from "../store";

import { types } from "../actions/types";
import { actions } from "../actions";

const URL = 'http://localhost:3001/auth/';

export const appStartEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_APP)
    .pipe(
        map(v => localStorage.getItem('isAuth') ?
            actions.global.initSessionAuth() :
            actions.global.setIsLoading(false)
        )
    );

export const authEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_AUTHENTICATION)
    .pipe(
        mergeMap(action =>
            from(fetchStreamService(
                `${URL}${state$.value.router.location.pathname.toLowerCase().slice(1)}`,
                'POST',
                action.payload
            )).pipe(
                map(value => actions.global.authSuccess({
                    session: false,
                    value
                })),
                catchError(err => of(actions.global.networkError(err)))
            )
        )
    );

export const sessionAuthEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_SESSION_AUTH)
    .pipe(
        mergeMap(action =>
            from(fetchStreamService(`${URL}${'sessionauth'}`, 'POST'))
                .pipe(
                    map(value => {
                        return value.status === 200 ?
                            actions.global.authSuccess({
                                session: true,
                                value
                            }) : actions.global.authFailure()
                    }),
                    catchError(err => of(actions.global.networkError(err)))
                )
        )
    );

export const authSuccessEpic: Epic = (action$, state$) => action$
    .ofType(types.AUTH_SUCCESS)
    .pipe(
        tap(v => console.log(v, 'in success')),
        mergeMap(resp => from(startSocketService(resp))),
        tap(resp => !resp.payload.session && localStorage.setItem('isAuth', 'true')),
        mergeMap(resp => of(
            actions.user.setUserData(resp.payload.value.data),
            actions.global.setIsUserLoggedIn(true),
            actions.global.setIsLoading(false),
            !resp.payload.session ? push('/dashboard') : { type: 'NULL' }
        ))
    );

export const authFailureEpic: Epic = (action$, state$) => action$
    .ofType(types.AUTH_FAILURE)
    .pipe(
        mergeMap(resp => of(
            push("/login"),
            actions.global.setIsLoading(false)
        ))
    );

export const logoutEpic: Epic = (action$, state$) => action$
    .ofType(types.INIT_LOGOUT)
    .pipe(
        tap(v => {
            Socket.close();
            console.log('WILL DISCONNECT YOU');
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
