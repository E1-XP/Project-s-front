import { Epic } from 'redux-observable';
import {
  map,
  filter,
  mapTo,
  catchError,
  mergeMap,
  tap,
  pluck,
  take,
  ignoreElements,
} from 'rxjs/operators';
import { of, merge, from, iif, EMPTY, combineLatest } from 'rxjs';
import { push } from 'connected-react-router';
import queryString from 'query-string';

import { fetch$ } from '../utils/fetchStream';

import { State } from '../store/interfaces';

import { types } from '../actions/types';
import { actions } from '../actions';

import config from './../config';

export const authEpic: Epic<any, any, State> = (action$, state$) =>
  action$
    .ofType(types.GLOBAL_INIT_AUTHENTICATION)
    .pipe(
      map(({ payload }) =>
        state$.value.router.location.pathname.toLowerCase().slice(1) === 'login'
          ? actions.global.initLogin(payload)
          : actions.global.initSignUp(payload),
      ),
    );

export const loginEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.GLOBAL_INIT_LOGIN).pipe(
    mergeMap(action =>
      fetch$(`${config.API_URL}/auth/login`, 'POST', action.payload).pipe(
        map(resp =>
          resp.status === 200
            ? actions.global.initGetUserData(resp.data)
            : actions.global.setFormMessage('invalid data provided'),
        ),
        catchError(err => of(actions.global.networkError(err))),
      ),
    ),
  );

export const getUserDataEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.USER_GET_USER_DATA).pipe(
    mergeMap(({ payload }) =>
      merge(
        of(actions.global.setIsLoading(true)),
        fetch$(`${config.API_URL}/users/${payload.id}`).pipe(
          map(resp => actions.global.initAuthSuccess(resp.data)),
          catchError(err => of(actions.global.networkError(err))),
        ),
      ),
    ),
  );

export const checkEmailEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.GLOBAL_INIT_EMAIL_CHECK).pipe(
    mergeMap(action =>
      fetch$(
        `${config.API_URL}${'/auth/emailcheck'}`,
        'POST',
        {
          email: action.payload,
        },
        undefined,
        { setIsFetching: false },
      ).pipe(
        map(({ status }) =>
          status === 200
            ? actions.global.setFormMessage('')
            : actions.global.setFormMessage('this email is already taken'),
        ),
        catchError(err => of(actions.global.networkError(err))),
      ),
    ),
  );

export const signUpEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.GLOBAL_INIT_SIGNUP).pipe(
    filter(() => !state$.value.global.formMessage),
    mergeMap(({ payload }) =>
      merge(
        of(actions.global.setIsLoading(true)),
        fetch$(`${config.API_URL}/auth/signup`, 'POST', payload).pipe(
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

export const sessionAuthEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.GLOBAL_INIT_SESSION_AUTH).pipe(
    mergeMap(action =>
      fetch$(`${config.API_URL}${'/auth/pagerefresh'}`, 'POST').pipe(
        map(({ status, data }) =>
          status === 200
            ? actions.global.initAuthSuccess(data)
            : actions.global.authFailure(),
        ),
        catchError(err => of(actions.global.networkError(err))),
      ),
    ),
  );

export const authSuccessEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.GLOBAL_INIT_AUTH_SUCCESS).pipe(
    pluck('payload'),
    tap(() => {
      !localStorage.getItem('isAuth') && localStorage.setItem('isAuth', 'true');
    }),
    mergeMap(data => {
      const pathName = state$.value.router.location.pathname.toLowerCase();
      const isOnFormPage = ['login', 'signup'].includes(pathName.slice(1));

      return of(
        actions.user.setUserData(data),
        actions.global.setIsUserLoggedIn(true),
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

export const authSuccessHandleLoadEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
  combineLatest([
    action$.ofType(types.GLOBAL_INIT_AUTH_SUCCESS).pipe(
      filter(() => {
        const pathName = state$.value.router.location.pathname.toLowerCase();

        return (
          !pathName.startsWith('/gallery') &&
          (!/^\/room\/\d+(\/|\/password|\/password\/)?$/.test(pathName) ||
            (/^\/room\/\d+(\/password|\/password\/)$/.test(pathName) &&
              !state$.value.rooms.list[pathName.split('/')[2]]))
        );
      }),
    ),
    action$.ofType(types.USER_SET_USER_DATA).pipe(take(1)),
    action$.ofType(types.ROOMS_SET).pipe(take(1)),
    action$.ofType(types.GLOBAL_SET_IS_USER_LOGGED_IN).pipe(take(1)),
  ]).pipe(mapTo(actions.global.setIsLoading(false)));

export const authFailureEpic: Epic<any, any, State> = (action$, state$) =>
  action$
    .ofType(types.GLOBAL_INIT_AUTH_FAILURE)
    .pipe(
      mergeMap(resp => of(push('/login'), actions.global.setIsLoading(false))),
    );

export const logoutEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.GLOBAL_INIT_LOGOUT).pipe(
    filter(() => {
      const pathName = state$.value.router.location.pathname;
      const isOnRoomRoute = /^\/room\/\d+(\/)?$/.test(pathName);
      const errorHappened = state$.value.global.hasErrored;

      if (!errorHappened && isOnRoomRoute) {
        return confirm('Are you sure? This will close your room.');
      }

      return true;
    }),
    tap(() => {
      localStorage.removeItem('isAuth');
    }),
    mergeMap(() =>
      merge(
        of(actions.global.setIsLoading(true), actions.socket.closeSocket()),
        fetch$(`${config.API_URL}${'/auth/logout'}`, 'POST').pipe(
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
