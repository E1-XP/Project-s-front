import { ActionType } from "./index";
import { types } from "./types";

export const setUserData: ActionType = (data: object) => ({
    type: types.SET_USER_DATA,
    payload: data
});
