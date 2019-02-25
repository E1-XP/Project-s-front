import { Epic } from 'redux-observable';
import {
  map,
  filter,
  mapTo,
  catchError,
  mergeMap,
  tap,
  ignoreElements,
} from 'rxjs/operators';
import { of, merge, from, iif, EMPTY } from 'rxjs';
import { push } from 'connected-react-router';
import queryString from 'query-string';

import { fetchStream } from '../utils/fetchStream';

import { store } from '../store';

import { types } from '../actions/types';
import { actions } from '../actions';

import config from './../config';

export const appStartEpic: Epic = (action$, state$) =>
  action$
    .ofType(types.INIT_APP)
    .pipe(
      mergeMap(() =>
        iif(
          () => !!localStorage.getItem('isAuth'),
          of(actions.global.initSessionAuth()),
          of(
            actions.global.setIsLoading(false),
            push(
              ['', 'login', 'dashboard'].includes(
                state$.value.router.location.pathname.toLowerCase().slice(1),
              )
                ? '/login'
                : `/login?link=${state$.value.router.location.pathname
                    .toLowerCase()
                    .slice(1)}`,
            ),
          ),
        ),
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
      fetchStream(`${config.API_URL}/auth/login`, 'POST', action.payload),
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
        fetchStream(`${config.API_URL}/users/${payload.id}`).pipe(
          map(resp => actions.global.initAuthSuccess(resp.data)),
          catchError(err => of(actions.global.networkError(err))),
        ),
      ),
    ),
  );

export const checkEmailEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_EMAIL_CHECK).pipe(
    mergeMap(action =>
      fetchStream(`${config.API_URL}${'/auth/emailcheck'}`, 'POST', {
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
        fetchStream(`${config.API_URL}/auth/signup`, 'POST', payload).pipe(
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
      fetchStream(`${config.API_URL}${'/auth/pagerefresh'}`, 'POST'),
    ),
    map(({ status, data }) =>
      status === 200
        ? actions.global.initAuthSuccess(data)
        : actions.global.authFailure(),
    ),
    catchError(err => of(actions.global.networkError(err))),
  );

export const authSuccessEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_AUTH_SUCCESS).pipe(
    tap(() => {
      !localStorage.getItem('isAuth') && localStorage.setItem('isAuth', 'true');
    }),
    mergeMap(data => {
      const pathName = state$.value.router.location.pathname;

      const isOnFormPage = ['login', 'signup'].includes(
        pathName.toLowerCase().slice(1),
      );
      const shouldSetLoadingAsFalse =
        !/^\/room\/\d+(\/|\/password|\/password\/)?$/.test(pathName) ||
        (/^\/room\/\d+(\/password|\/password\/)$/.test(pathName) &&
          !state$.value.rooms.list[pathName.split('/')[2]]);

      return of(
        actions.user.setUserData(data),
        actions.global.setIsUserLoggedIn(true),
        shouldSetLoadingAsFalse
          ? actions.global.setIsLoading(false)
          : { type: 'NULL' },
        isOnFormPage
          ? push(
              state$.value.router.location.search.includes('link')
                ? queryString
                    .parse(state$.value.router.location.search)
                    .link!.toString()
                : '/dashboard',
            )
          : { type: 'NULL' },
      );
    }),
  );

export const authFailureEpic: Epic = (action$, state$) =>
  action$
    .ofType(types.INIT_AUTH_FAILURE)
    .pipe(
      mergeMap(resp => of(push('/login'), actions.global.setIsLoading(false))),
    );

export const logoutEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_LOGOUT).pipe(
    filter(() => {
      const pathName = state$.value.router.location.pathname;
      const isOnRoomRoute = /^\/room\/\d+(\/)?$/.test(pathName);

      let shouldLeave = true;
      if (isOnRoomRoute) {
        shouldLeave = confirm('Are you sure? This will close your room.');
      }

      return shouldLeave;
    }),
    tap(() => {
      localStorage.removeItem('isAuth');
    }),
    mergeMap(() =>
      merge(
        of(actions.global.setIsLoading(true), actions.socket.closeSocket()),
        fetchStream(`${config.API_URL}${'/auth/logout'}`, 'POST').pipe(
          mergeMap(resp =>
            of(
              push('/login'),
              actions.global.setIsUserLoggedIn(false),
              actions.users.setUsers({}),
              actions.chats.setMessages({ data: [], channel: 'general' }),
              actions.user.setUserData(null),
              actions.rooms.setRooms(null),
              actions.global.setIsLoading(false),
            ),
          ),
          catchError(err => of(actions.global.networkError(err))),
        ),
      ),
    ),
  );
