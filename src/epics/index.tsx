import { Epic, combineEpics } from "redux-observable";
import { catchError, mergeMap, tap } from "rxjs/operators";
import { of, from } from "rxjs";
import { push } from "connected-react-router";

import { fetchStreamService } from '../services/fetch.service';
import { startSocketService, Socket } from "../services/socket.service";

import { types } from "../actions/types";
import { actions } from "../actions";

const URL = 'http://localhost:3001/auth/';

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
                mergeMap(data => of(
                    actions.global.setIsUserLoggedIn(true),
                    push('/dashboard'),
                    actions.user.setUserData(data)
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
                    actions.global.setIsUserLoggedIn(true),
                    actions.global.setIsLoading(false),
                    actions.user.setUserData(resp.data),
                ))
            )
        )
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
    authEpic,
    sessionAuthEpic,
    logoutEpic
);
