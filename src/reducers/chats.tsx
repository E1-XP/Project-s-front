import { Reducer } from "redux";
import { types } from "../actions/types";

import { PlainAction } from "./index";

export const chatsReducer: Reducer = (state: any = {}, action: PlainAction) => {
  switch (action.type) {
    case types.SET_MESSAGES: {
      const { channel } = action.payload;

      const newState = { ...state };
      newState[channel] = action.payload.data;

      return newState;
    }
    default:
      return state;
  }
};
