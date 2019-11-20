import { combineEpics } from 'redux-observable';

import * as globalEpics from './global';
import * as authEpics from './authentication';
import * as messagesEpics from './messages';
import * as roomEpics from './room';
import * as roomRouteEpics from './roomroute';
import * as canvasEpics from './canvas';
import * as drawingEpics from './drawing';
import * as galleryRouteEpics from './galleryroute';
import * as socketEpics from './socket';
import * as socketEmitEpics from './socketemit';

const isEpic = (itm: string) => itm.endsWith('Epic');

const mapObjectToArray = (obj: any): any[] =>
  Object.keys(obj)
    .filter(isEpic)
    .map(key => obj[key]);

export const rootEpic = combineEpics(
  ...mapObjectToArray(globalEpics),
  ...mapObjectToArray(authEpics),
  ...mapObjectToArray(messagesEpics),
  ...mapObjectToArray(roomEpics),
  ...mapObjectToArray(roomRouteEpics),
  ...mapObjectToArray(canvasEpics),
  ...mapObjectToArray(drawingEpics),
  ...mapObjectToArray(galleryRouteEpics),
  ...mapObjectToArray(socketEpics),
  ...mapObjectToArray(socketEmitEpics),
);
