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
import { of, merge, from, iif } from 'rxjs';
import { push } from 'connected-react-router';

import { types } from '../actions/types';
import { actions } from '../actions';

import { State } from '../store/interfaces';

import config from './../config';

export const appStartEpic: Epic = (action$, state$) =>
  action$.ofType(types.GLOBAL_INIT_APP).pipe(
    mergeMap(() => {
      const currLocation = state$.value.router.location.pathname
        .toLowerCase()
        .slice(1);

      return iif(
        () => !!localStorage.getItem('isAuth'),
        of(actions.global.initSessionAuth()),
        of(
          actions.global.setIsLoading(false),
          push(
            ['', 'login', 'signup', 'dashboard'].includes(currLocation)
              ? currLocation === 'signup'
                ? '/signup'
                : '/login'
              : `/login?link=${state$.value.router.location.pathname
                  .toLowerCase()
                  .slice(1)}`,
          ),
        ),
      );
    }),
  );

export const handleErrorsEpic: Epic<any, any, State> = (action$, state$) =>
  action$.ofType(types.GLOBAL_NETWORK_ERROR).pipe(
    tap(({ payload }) => console.log('ERROR: ', payload)),
    mergeMap(() => of(actions.global.setHasErrored(true), push('/500'))),
  );
