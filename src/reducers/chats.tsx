import { Reducer } from "redux";
import { types } from '../actions/types';

import { plainAction } from './index';

export const chatsReducer: Reducer = (state: any = {}, action: plainAction) => {
    switch (action.type) {
        case types.SET_MESSAGES: {
            const newState = {
                ...state,
                general: state.general.concat(),
                selectedRoom: state.selectedRoom.concat()
            };

            newState[action.payload.channel] = action.payload.data;
            return newState;
        };
        default: return state;
    }
};
