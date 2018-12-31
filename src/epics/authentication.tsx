import { Epic } from 'redux-observable';
import {
  map,
  mapTo,
  catchError,
  mergeMap,
  tap,
  ignoreElements,
} from 'rxjs/operators';
import { of, merge, from } from 'rxjs';
import { push } from 'connected-react-router';

import { fetchStreamService } from '../services/fetchService';
import { startSocketService, Socket } from '../services/socketService';

import { store } from '../store';

import { types } from '../actions/types';
import { actions } from '../actions';

import config from './../../config';

export const appStartEpic: Epic = (action$, state$) =>
  action$
    .ofType(types.INIT_APP)
    .pipe(
      map(v =>
        localStorage.getItem('isAuth')
          ? actions.global.initSessionAuth()
          : actions.global.setIsLoading(false),
      ),
    );

export const authEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_AUTHENTICATION).pipe(
    map(({ payload }) =>
      state$.value.router.location.pathname.toLowerCase().slice(1) === 'login'
        ? actions.global.initLogin(payload)
        : actions.global.initSignUp(payload),
    ),
    catchError(err => of(actions.global.networkError(err))),
  );

export const loginEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_LOGIN).pipe(
    mergeMap(action =>
      fetchStreamService(
        `${config.API_URL}/auth/login`,
        'POST',
        action.payload,
      ),
    ),
    map(resp =>
      resp.status === 200
        ? actions.global.initGetUserData(resp.data)
        : actions.global.setFormMessage('invalid data provided'),
    ),
    catchError(err => of(actions.global.networkError(err))),
  );

export const getUserDataEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_GET_USER_DATA).pipe(
    mergeMap(({ payload }) =>
      merge(
        of(actions.global.setIsLoading(true)),
        fetchStreamService(`${config.API_URL}/users/${payload.id}`).pipe(
          map(resp => actions.global.initAuthSuccess(resp.data)),
          catchError(err => of(actions.global.networkError(err))),
        ),
      ),
    ),
  );

export const checkEmailEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_EMAIL_CHECK).pipe(
    mergeMap(action =>
      fetchStreamService(`${config.API_URL}${'/auth/emailcheck'}`, 'POST', {
        email: action.payload,
      }),
    ),
    map(({ status }) =>
      status === 200
        ? actions.global.setFormMessage('')
        : actions.global.setFormMessage('this email is already taken'),
    ),
  );

export const signUpEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_SIGNUP).pipe(
    mergeMap(({ payload }) =>
      merge(
        of(actions.global.setIsLoading(true)),
        fetchStreamService(
          `${config.API_URL}/auth/signup`,
          'POST',
          payload,
        ).pipe(
          map(({ status, data }) =>
            status === 200
              ? actions.global.initAuthSuccess(data)
              : actions.global.authFailure(),
          ),
          catchError(err => of(actions.global.networkError(err))),
        ),
      ),
    ),
  );

export const sessionAuthEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_SESSION_AUTH).pipe(
    mergeMap(action =>
      fetchStreamService(`${config.API_URL}${'/auth/pagerefresh'}`, 'POST'),
    ),
    map(({ status, data }) =>
      status === 200
        ? actions.global.initAuthSuccess(data)
        : actions.global.authFailure(),
    ),
    catchError(err => of(actions.global.networkError(err))),
  );

export const authSuccessEpic: Epic = (action$, { value: { router } }) =>
  action$.ofType(types.INIT_AUTH_SUCCESS).pipe(
    tap(v => console.log(v, 'in success')),
    mergeMap(resp => from(startSocketService(resp))),
    tap(() => localStorage.setItem('isAuth', 'true')),
    mergeMap(resp =>
      of(
        actions.user.setUserData(resp.payload),
        actions.global.setIsUserLoggedIn(true),
        actions.global.setIsLoading(false),
        router.location.pathname.toLowerCase().slice(1) === 'login' || 'signup'
          ? push('/dashboard')
          : { type: 'NULL' },
      ),
    ),
  );

export const authFailureEpic: Epic = (action$, state$) =>
  action$
    .ofType(types.INIT_AUTH_FAILURE)
    .pipe(
      mergeMap(resp => of(push('/login'), actions.global.setIsLoading(false))),
    );

export const logoutEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_LOGOUT).pipe(
    tap(v => {
      Socket!.close();
      console.log('WILL DISCONNECT YOU');
      localStorage.removeItem('isAuth');
    }),
    mergeMap(action =>
      merge(
        of(actions.global.setIsLoading(true)),
        fetchStreamService(`${config.API_URL}${'/auth/logout'}`, 'POST').pipe(
          mergeMap(resp =>
            of(
              push('/login'),
              actions.global.setIsUserLoggedIn(false),
              actions.user.setUserData(null),
              actions.global.setIsLoading(false),
            ),
          ),
          catchError(err => of(actions.global.networkError(err))),
        ),
      ),
    ),
  );
