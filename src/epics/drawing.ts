import { Epic } from 'redux-observable';
import {
  map,
  mergeMap,
  tap,
  ignoreElements,
  debounceTime,
  take,
  takeWhile,
  mapTo,
  pluck,
  catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';

import { store } from '../store';

import { types } from '../actions/types';
import { actions } from '../actions';

import config from './../config';

export const checkInboxEpic: Epic = (action$, state$) =>
  action$.ofType(types.USER_CHECK_INBOX).pipe();
