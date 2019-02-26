import { Epic } from 'redux-observable';
import {
  map,
  mergeMap,
  tap,
  ignoreElements,
  take,
  mapTo,
  pluck,
  filter,
} from 'rxjs/operators';
import { of, iif, EMPTY, combineLatest } from 'rxjs';
import { push, LOCATION_CHANGE } from 'connected-react-router';
import queryString from 'query-string';

import { types } from '../actions/types';
import { actions } from '../actions';

import {
  isRoomLinkParamIncludedInLastRoute,
  isRoomPasswordCheckedAndValid,
} from './helpers';

export const setRouteContainsRoomLinkParam: Epic = (action$, state$) =>
  action$.ofType(LOCATION_CHANGE).pipe(
    pluck<any, any>('payload'),
    filter(
      payload =>
        state$.value.router.location.search.includes('link') &&
        /^room\/\d+$/.test(
          queryString
            .parse(state$.value.router.location.search)
            .link!.toString(),
        ),
    ),
    tap(() => isRoomLinkParamIncludedInLastRoute.next(true)),
    ignoreElements(),
  );

export const roomRouteEpic: Epic = (action$, state$) =>
  action$.ofType(LOCATION_CHANGE).pipe(
    pluck<any, any>('payload'),
    filter(
      payload =>
        /^\/room\/\d+$/.test(payload.location.pathname) &&
        state$.value.global.isUserLoggedIn &&
        state$.value.rooms.list[payload.location.pathname.split('/')[2]],
    ),
    mergeMap(() =>
      iif(
        () => isRoomPasswordCheckedAndValid.value === null,
        of(actions.global.setIsLoading(true), actions.rooms.initRoomEnter()),
        EMPTY,
      ),
    ),
  );

export const handleRoomRouteInstantEnterEpic: Epic = (action$, state$) =>
  combineLatest([
    action$
      .ofType(LOCATION_CHANGE)
      .pipe(
        filter(
          ({ payload }) =>
            isRoomPasswordCheckedAndValid.value === null &&
            !state$.value.global.isUserLoggedIn &&
            /^\/room\/\d+$/.test(payload.location.pathname),
        ),
      ),
    action$.ofType(types.USER_SET_USER_DATA).pipe(take(1)),
    action$.ofType(types.ROOMS_SET).pipe(take(1)),
    action$.ofType(types.GLOBAL_SET_IS_USER_LOGGED_IN).pipe(take(1)),
  ]).pipe(
    map(arr =>
      arr[2].payload[state$.value.router.location.pathname.split('/')[2]]
        ? actions.rooms.initRoomEnter()
        : actions.global.setIsLoading(false),
    ),
  );

export const redirectFromPasswordRouteIfRoomNotExistAndNotLogged: Epic = (
  action$,
  state$,
) =>
  combineLatest([
    action$.ofType(LOCATION_CHANGE).pipe(
      pluck<any, any>('payload'),
      filter(
        payload =>
          /^\/room\/\d+\/password$/.test(payload.location.pathname) &&
          !state$.value.global.isUserLoggedIn,
      ),
    ),
    action$.ofType(types.GLOBAL_SET_IS_USER_LOGGED_IN).pipe(take(1)),
    action$.ofType(types.ROOMS_SET).pipe(take(1)),
  ]).pipe(
    mapTo(push(`/room/${state$.value.router.location.pathname.split('/')[2]}`)),
  );
