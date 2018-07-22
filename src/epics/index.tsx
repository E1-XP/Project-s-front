import { combineEpics } from "redux-observable";

import * as authEpics from './authentication';
import * as roomEpics from './room';

const mapObjectToArray = (obj: any): any[] => Object.keys(obj).map(itm => obj[itm]);

export const rootEpic =
    combineEpics(
        ...mapObjectToArray(authEpics),
        ...mapObjectToArray(roomEpics)
    );
