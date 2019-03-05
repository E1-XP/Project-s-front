import { combineEpics } from 'redux-observable';

import * as authEpics from './authentication';
import * as dashboardEpics from './dashboard';
import * as roomEpics from './room';
import * as roomRouteEpics from './roomRoute';
import * as canvasEpics from './canvas';
import * as drawingEpics from './drawing';
import * as socketEpics from './socket';
import * as socketEmitEpics from './socketEmit';

const isEpic = (itm: string) => itm.includes('Epic');

const mapObjectToArray = (obj: any): any[] =>
  Object.keys(obj)
    .filter(key => isEpic(key))
    .map(itm => obj[itm]);

export const rootEpic = combineEpics(
  ...mapObjectToArray(authEpics),
  ...mapObjectToArray(dashboardEpics),
  ...mapObjectToArray(roomEpics),
  ...mapObjectToArray(roomRouteEpics),
  ...mapObjectToArray(canvasEpics),
  ...mapObjectToArray(drawingEpics),
  ...mapObjectToArray(socketEpics),
  ...mapObjectToArray(socketEmitEpics),
);
