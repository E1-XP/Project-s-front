import { ActionType } from './index';
import { types } from './types';

export const setIsLoading: ActionType = (bool: boolean) => ({
    type: types.SET_IS_LOADING,
    payload: bool
});

export const initApp: ActionType = () =>
    ({ type: types.INIT_APP });

export const initAuthentication: ActionType = () =>
    ({ type: types.INIT_AUTHENTICATION });

export const initLogout: ActionType = () =>
    ({ type: types.INIT_LOGOUT });

export const initSessionAuth: ActionType = () => ({
    type: types.INIT_SESSION_AUTH
});

export const saveFormDataIntoStore: ActionType = (data: object) => ({
    type: types.SAVE_FORM_DATA_INTO_STORE,
    payload: data
});

export const setIsUserLoggedIn: ActionType = (bool: boolean) => ({
    type: types.SET_IS_USER_LOGGED_IN,
    payload: bool
});

export const setSocketConnectionStatus: ActionType = (bool: boolean) => ({
    type: types.SET_SOCKET_CONNECTION_STATUS,
    payload: bool
});

export const networkError: ActionType = (err: any) => ({
    type: types.NETWORK_ERROR,
    payload: err
});
