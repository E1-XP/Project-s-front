import { Epic } from 'redux-observable';
import {
  map,
  mapTo,
  filter,
  mergeMap,
  tap,
  ignoreElements,
  pluck,
  take,
} from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { LOCATION_CHANGE } from 'connected-react-router';

import { State } from './../store/interfaces';
import { store } from '../store';

import { types } from '../actions/types';
import { actions } from '../actions';

export const galleryRouteEpic: Epic = (action$, state$) =>
  action$.ofType(LOCATION_CHANGE).pipe(
    filter(
      ({ payload }) =>
        payload.location.pathname.toLowerCase().startsWith('/gallery') &&
        state$.value.user.userData.id !== null,
    ),
    mergeMap(() =>
      of(
        actions.global.setIsLoading(true),
        actions.canvas.initGetImagesFromServer(),
      ),
    ),
  );

export const galleryRouteInstantEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
  combineLatest([
    action$
      .ofType(LOCATION_CHANGE)
      .pipe(
        filter(
          ({ payload }) =>
            payload.location.pathname.toLowerCase().startsWith('/gallery') &&
            !state$.value.global.isUserLoggedIn,
        ),
      ),
    action$.ofType(types.USER_SET_USER_DATA).pipe(take(1)),
    action$.ofType(types.ROOMS_SET).pipe(take(1)),
    action$.ofType(types.GLOBAL_SET_IS_USER_LOGGED_IN).pipe(take(1)),
  ]).pipe(mapTo(actions.canvas.initGetImagesFromServer()));

export const galleryRouteEnterEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.CANVAS_SET_USER_DRAWINGS).pipe(
    filter(() =>
      state$.value.router.location.pathname
        .toLowerCase()
        .startsWith('/gallery'),
    ),
    mapTo(actions.global.setIsLoading(false)),
  );
