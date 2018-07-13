import { ActionType } from "./index";
import { types } from "./types";

export const setMessages: ActionType = (data: object) => ({
    type: types.SET_MESSAGES,
    payload: data
});
