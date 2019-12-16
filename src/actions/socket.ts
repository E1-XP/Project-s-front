import { types } from './types';
import { DrawingPoint } from '../store/interfaces';

export const setSocketConnectionStatus = (bool: boolean) => ({
  type: types.SOCKET_SET_CONNECTION_STATUS,
  payload: bool,
});

export const bindHandlers = () => ({
  type: types.SOCKET_BIND_HANDLERS,
});

export const bindRoomHandlers = () => ({
  type: types.SOCKET_BIND_ROOM_HANDLERS,
});

export const unbindRoomHandlers = () => ({
  type: types.SOCKET_UNBIND_ROOM_HANDLERS,
});

export const closeSocket = () => ({
  type: types.SOCKET_CLOSE,
});

export const reconnectInRoom = () => ({
  type: types.SOCKET_RECONNECT_IN_ROOM,
});

export const emitRoomDraw = (data: any) => ({
  type: types.SOCKET_EMIT_ROOM_DRAW,
  payload: data,
});

export const emitRoomDrawChange = (data: any) => ({
  type: types.SOCKET_EMIT_ROOM_DRAW_CHANGE,
  payload: data,
});

export const emitRoomDrawMouseup = (data: any) => ({
  type: types.SOCKET_EMIT_ROOM_DRAW_MOUSEUP,
  payload: data,
});

export const emitRoomDrawReconnect = (data: DrawingPoint[]) => ({
  type: types.SOCKET_EMIT_ROOM_DRAW_RECONNECT,
  payload: data,
});

export const emitRoomDrawReset = (data: any) => ({
  type: types.SOCKET_EMIT_ROOM_DRAW_RESET,
  payload: data,
});

export const emitRoomSetAdmin = (data: any) => ({
  type: types.SOCKET_EMIT_ROOM_SET_ADMIN,
  payload: data,
});

export const emitRoomCreate = (data: any) => ({
  type: types.SOCKET_EMIT_ROOM_CREATE,
  payload: data,
});

export const emitGeneralMessage = (data: any) => ({
  type: types.SOCKET_EMIT_GENERAL_MESSAGE,
  payload: data,
});

export const emitMessageWrite = (data: any) => ({
  type: types.SOCKET_EMIT_MESSAGE_WRITE,
  payload: data,
});

export const emitRoomMessage = (data: any) => ({
  type: types.SOCKET_EMIT_ROOM_MESSAGE,
  payload: data,
});

export const emitInboxMessage = (data: any) => ({
  type: types.SOCKET_EMIT_INBOX_MESSAGE,
  payload: data,
});
