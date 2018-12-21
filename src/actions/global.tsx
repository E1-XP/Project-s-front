import { ActionType } from './index';
import { types } from './types';

export const setIsLoading: ActionType = (bool: boolean) => ({
  type: types.SET_IS_LOADING,
  payload: bool,
});

export const initApp: ActionType = () => ({
  type: types.INIT_APP,
});

export const initAuthentication: ActionType = (data: object) => ({
  type: types.INIT_AUTHENTICATION,
  payload: data,
});

export const initLogin: ActionType = (data: object) => ({
  type: types.INIT_LOGIN,
  payload: data,
});

export const initSignUp: ActionType = (data: object) => ({
  type: types.INIT_SIGNUP,
  payload: data,
});

export const initAuthSuccess: ActionType = data => ({
  type: types.INIT_AUTH_SUCCESS,
  payload: data,
});

export const authFailure: ActionType = data => ({
  type: types.INIT_AUTH_FAILURE,
});

export const initGetUserData: ActionType = (data: object) => ({
  type: types.INIT_GET_USER_DATA,
  payload: data,
});

export const setFormMessage: ActionType = (data: object) => ({
  type: types.SET_FORM_MESSAGE,
  payload: data,
});

export const initLogout: ActionType = () => ({
  type: types.INIT_LOGOUT,
});

export const initSessionAuth: ActionType = () => ({
  type: types.INIT_SESSION_AUTH,
});

export const setIsUserLoggedIn: ActionType = (bool: boolean) => ({
  type: types.SET_IS_USER_LOGGED_IN,
  payload: bool,
});

export const setInboxCount: ActionType = (v?: number) => ({
  type: types.SET_INBOX_COUNT,
  payload: v,
});

export const setSocketConnectionStatus: ActionType = (bool: boolean) => ({
  type: types.SET_SOCKET_CONNECTION_STATUS,
  payload: bool,
});

export const networkError: ActionType = (err: any) => ({
  type: types.NETWORK_ERROR,
  payload: err,
});
