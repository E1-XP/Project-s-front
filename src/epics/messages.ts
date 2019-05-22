import { Epic } from 'redux-observable';
import {
  map,
  filter,
  mergeMap,
  tap,
  take,
  ignoreElements,
  mapTo,
  pluck,
  catchError,
  debounceTime,
  throttleTime,
} from 'rxjs/operators';
import { of, from, iif, combineLatest } from 'rxjs';
import { LOCATION_CHANGE } from 'connected-react-router';

import { fetch$ } from '../utils/fetchStream';

import { types } from '../actions/types';
import { actions } from '../actions';

import { InvitationData } from '../components/canvas/toolbar';
import { State } from '../store/interfaces';

import config from './../config';

export const handleSendGeneralMessageEpic: Epic = (action$, state$) =>
  action$.ofType(types.MESSAGES_SEND_GENERAL).pipe(
    pluck('payload'),
    map(data => actions.socket.emitGeneralMessage(data)),
  );

export const handleMessageWriteEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
  action$.ofType(types.MESSAGES_WRITE).pipe(
    throttleTime(1000),
    map(() => {
      const pathname = state$.value.router.location.pathname.toLowerCase();
      const payload = pathname.startsWith('/dashboard')
        ? 'general'
        : state$.value.rooms.active;

      return actions.socket.emitMessageWrite(payload);
    }),
  );

export const handleMessageWriteBroadcastEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
  action$.ofType(types.MESSAGES_WRITE_BROADCAST).pipe(
    filter(({ writerId }: any) => writerId !== null),
    debounceTime(1500),
    map(({ writerId }: any) =>
      actions.chats.handleWriteMessageBroadcastClear(writerId),
    ),
  );

export const fetchOnInboxRouteEpic: Epic = (action$, state$) =>
  action$.ofType(LOCATION_CHANGE).pipe(
    pluck<any, any>('payload'),
    filter(payload =>
      payload.location.pathname.toLowerCase().startsWith('/inbox'),
    ),
    mergeMap(() =>
      of(actions.user.setInboxCount(0), actions.user.initCheckInbox()),
    ),
  );

export const fetchOnInboxRouteInstantEpic: Epic<any, any, State> = (
  action$,
  state$,
) =>
  combineLatest([
    action$
      .ofType(LOCATION_CHANGE)
      .pipe(
        filter(
          ({ payload }) =>
            payload.location.pathname.toLowerCase().startsWith('/inbox') &&
            !state$.value.global.isUserLoggedIn,
        ),
      ),
    action$.ofType(types.USER_SET_USER_DATA).pipe(take(1)),
    action$.ofType(types.ROOMS_SET).pipe(take(1)),
    action$.ofType(types.GLOBAL_SET_IS_USER_LOGGED_IN).pipe(take(1)),
  ]).pipe(
    mergeMap(() =>
      of(actions.user.setInboxCount(0), actions.user.initCheckInbox()),
    ),
  );

export const checkInboxEpic: Epic = (action$, state$) =>
  action$.ofType(types.USER_CHECK_INBOX).pipe(
    mergeMap(action =>
      fetch$(
        `${config.API_URL}/users/${state$.value.user.userData.id}/inbox`,
      ).pipe(
        map(resp => actions.user.setInboxMessages(resp.data.messages)),
        catchError(err => of(actions.global.networkError(err))),
      ),
    ),
  );

export const sendRoomInvitationEpic: Epic = (action$, state$) =>
  action$.ofType(types.USER_SEND_INBOX_MESSAGE).pipe(
    pluck<{}, InvitationData>('payload'),
    map(data => actions.socket.emitInboxMessage(data)),
  );

export const receiveRoomInvitationEpic: Epic = (action$, state$) =>
  action$
    .ofType(types.USER_RECEIVE_INBOX_MESSAGE)
    .pipe(mapTo(actions.user.setInboxCount()));
