import { Epic } from 'redux-observable';
import {
  map,
  mergeMap,
  tap,
  ignoreElements,
  mapTo,
  pluck,
  catchError,
} from 'rxjs/operators';
import { of, from, iif } from 'rxjs';
import { push } from 'connected-react-router';

import { fetchStream } from '../utils/fetchStream';

import { store } from '../store';

import { types } from '../actions/types';
import { actions } from '../actions';

import { InvitationData } from '../components/canvas/toolbar';

import config from './../config';

export const handleSendGeneralMessageEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_SEND_GENERAL_MESSAGE).pipe(
    pluck('payload'),
    map(data => actions.socket.emitGeneralMessage(data)),
  );

export const checkInboxEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_CHECK_INBOX).pipe(
    mergeMap(action =>
      fetchStream(
        `${config.API_URL}/users/${state$.value.user.userData.id}/inbox`,
      ),
    ),
    map(resp => actions.user.setInboxMessages(resp.data.messages)),
    catchError(err => of(actions.global.networkError(err))),
  );

export const sendRoomInvitationEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_SEND_INBOX_MESSAGE).pipe(
    pluck<{}, InvitationData>('payload'),
    map(data => actions.socket.emitInboxMessage(data)),
  );

export const receiveRoomInvitationEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_RECEIVE_INBOX_MESSAGE).pipe(
    tap(v => {
      console.log('RECEIVED NEW MESSAGE');
    }),
    mapTo(actions.global.setInboxCount()),
  );