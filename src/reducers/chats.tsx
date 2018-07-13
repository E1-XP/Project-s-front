import { Reducer } from "redux";
import { types } from '../actions/types';

import { plainAction } from './index';

export const chatsReducer: Reducer = (state: any = {}, action: plainAction) => {
    switch (action.type) {
        case types.SET_MESSAGES: {
            console.log(action.payload, 'RECEIVED MESSAGES FROM THE SERVER');

            const newState: any = {
                ...state,
                general: state.general.concat(),
                selectedRoom: state.selectedRoom.concat()
            };

            const messages = Object.keys(action.payload.data).reduce((acc: any[], itm: any) => {
                acc = acc.concat({
                    author: action.payload.data[itm].split('\n')[1],
                    message: action.payload.data[itm].split('\n')[0]
                });
                return acc;
            }, []);

            newState[action.payload.channel] = messages;
            return newState;
        };
        default: return state;
    }
};
