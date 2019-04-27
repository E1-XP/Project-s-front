import { ActionType } from './index';
import { types } from './types';

export const setIsLoading: ActionType = (bool: boolean) => ({
  type: types.GLOBAL_SET_IS_LOADING,
  payload: bool,
});

export const setIsFetching: ActionType = (bool: boolean) => ({
  type: types.GLOBAL_SET_IS_FETCHING,
  payload: bool,
});

export const initApp: ActionType = () => ({
  type: types.GLOBAL_INIT_APP,
});

export const initAuthentication: ActionType = (data: object) => ({
  type: types.GLOBAL_INIT_AUTHENTICATION,
  payload: data,
});

export const initLogin: ActionType = (data: object) => ({
  type: types.GLOBAL_INIT_LOGIN,
  payload: data,
});

export const initEmailCheck: ActionType = (data: string) => ({
  type: types.GLOBAL_INIT_EMAIL_CHECK,
  payload: data,
});

export const initSignUp: ActionType = (data: object) => ({
  type: types.GLOBAL_INIT_SIGNUP,
  payload: data,
});

export const initAuthSuccess: ActionType = data => ({
  type: types.GLOBAL_INIT_AUTH_SUCCESS,
  payload: data,
});

export const authFailure: ActionType = data => ({
  type: types.GLOBAL_INIT_AUTH_FAILURE,
});

export const initGetUserData: ActionType = (data: object) => ({
  type: types.USER_GET_USER_DATA,
  payload: data,
});

export const setFormMessage: ActionType = (data: object) => ({
  type: types.GLOBAL_SET_FORM_MESSAGE,
  payload: data,
});

export const initLogout: ActionType = () => ({
  type: types.GLOBAL_INIT_LOGOUT,
});

export const initSessionAuth: ActionType = () => ({
  type: types.GLOBAL_INIT_SESSION_AUTH,
});

export const setIsUserLoggedIn: ActionType = (bool: boolean) => ({
  type: types.GLOBAL_SET_IS_USER_LOGGED_IN,
  payload: bool,
});

export const networkError: ActionType = (err: any) => ({
  type: types.GLOBAL_NETWORK_ERROR,
  payload: err,
});
