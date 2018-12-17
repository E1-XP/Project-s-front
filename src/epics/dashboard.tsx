import { Epic } from 'redux-observable';
import {
  map,
  mergeMap,
  tap,
  ignoreElements,
  mapTo,
  pluck,
} from 'rxjs/operators';
import { of, from, iif } from 'rxjs';
import { push } from 'connected-react-router';

import { fetchStreamService } from '../services/fetch.service';
import { Socket } from '../services/socket.service';

import { store } from '../store';

import { types } from '../actions/types';
import { actions } from '../actions';

import { InvitationData } from '../components/canvas/navbar';

import config from './../../config';

export const handleSendGeneralMessageEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_SEND_GENERAL_MESSAGE).pipe(
    pluck('payload'),
    tap(data => {
      Socket!.emit('general/messages', data);
    }),
    ignoreElements(),
  );

export const checkInboxEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_CHECK_INBOX).pipe(
    mergeMap(action =>
      from(
        fetchStreamService(
          `${config.API_URL}/users/${state$.value.user.userData.id}/inbox`,
          'GET',
        ),
      ),
    ),
    map(resp => actions.user.setInboxMessages(resp.data.messages)),
  );

export const sendRoomInvitationEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_SEND_INBOX_MESSAGE).pipe(
    pluck<{}, any>('payload'),
    tap((data: InvitationData) => {
      Socket!.emit(`${data.senderId}/inbox`, data);
    }),
    ignoreElements(),
  );

export const receiveRoomInvitationEpic: Epic = (action$, state$) =>
  action$.ofType(types.INIT_RECEIVE_INBOX_MESSAGE).pipe(
    tap(v => {
      console.log('RECEIVED NEW MESSAGE');
    }),
    mapTo(actions.global.setInboxCount()),
  );
