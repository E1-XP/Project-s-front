enum global {
  GLOBAL_SET_IS_LOADING = 'GLOBAL_SET_IS_LOADING',
  GLOBAL_SET_IS_FETCHING = 'GLOBAL_SET_IS_FETCHING',
  GLOBAL_INIT_APP = 'GLOBAL_INIT_APP',
  GLOBAL_INIT_AUTHENTICATION = 'GLOBAL_INIT_AUTHENTICATION',
  GLOBAL_INIT_LOGIN = 'GLOBAL_INIT_LOGIN',
  GLOBAL_INIT_EMAIL_CHECK = 'GLOBAL_INIT_EMAIL_CHECK',
  GLOBAL_INIT_SIGNUP = 'GLOBAL_INIT_SIGNUP',
  GLOBAL_INIT_SESSION_AUTH = 'GLOBAL_INIT_SESSION_AUTH',
  GLOBAL_INIT_AUTH_SUCCESS = 'GLOBAL_INIT_AUTH_SUCCESS',
  GLOBAL_INIT_AUTH_FAILURE = 'GLOBAL_INIT_AUTH_FAILURE',
  GLOBAL_INIT_LOGOUT = 'GLOBAL_INIT_LOGOUT',
  GLOBAL_SAVE_FORM_DATA_INTO_STORE = 'GLOBAL_SAVE_FORM_DATA_INTO_STORE',
  GLOBAL_SET_IS_USER_LOGGED_IN = 'GLOBAL_SET_IS_USER_LOGGED_IN',
  GLOBAL_SET_FORM_MESSAGE = 'GLOBAL_SET_FORM_MESSAGE',
  GLOBAL_SET_USERS = 'GLOBAL_SET_USERS',
  GLOBAL_SET_HAS_ERRORED = 'GLOBAL_SET_HAS_ERRORED',
  GLOBAL_NETWORK_ERROR = 'GLOBAL_NETWORK_ERROR',
}

enum user {
  USER_GET_USER_DATA = 'USER_GET_USER_DATA',
  USER_SET_USER_DATA = 'USER_SET_USER_DATA',
  USER_CHECK_INBOX = 'USER_CHECK_INBOX',
  USER_SET_INBOX_MESSAGES = 'USER_SET_INBOX_MESSAGES',
  USER_SEND_INBOX_MESSAGE = 'USER_SEND_INBOX_MESSAGE',
  USER_RECEIVE_INBOX_MESSAGE = 'USER_RECEIVE_INBOX_MESSAGE',
  USER_SET_INBOX_COUNT = 'USER_SET_INBOX_COUNT',
}

enum messages {
  MESSAGES_SET = 'MESSAGES_SET',
  MESSAGES_SEND_GENERAL = 'MESSAGES_SEND_GENERAL',
  MESSAGES_WRITE = 'MESSAGES_WRITE',
  MESSAGES_WRITE_BROADCAST = 'MESSAGES_WRITE_BROADCAST',
  MESSAGES_WRITE_BROADCAST_CLEAR = 'MESSAGES_WRITE_BROADCAST_CLEAR',
}

enum rooms {
  ROOMS_SET = 'ROOMS_SET',
  ROOMS_SET_CURRENT = 'ROOMS_SET_CURRENT',
  ROOMS_SET_ACTIVE_USERS = 'ROOMS_SET_ACTIVE_USERS',
  ROOMS_SEND_MESSAGE = 'INIT_SEND_ROOML_MESSAGE',
  ROOMS_INIT_ENTER = 'ROOMS_INIT_ENTER',
  ROOMS_INIT_LEAVE = 'ROOMS_INIT_LEAVE',
  ROOMS_INIT_ADMIN_LEAVE = 'ROOMS_INIT_ADMIN_LEAVE',
  ROOMS_INIT_CREATE = 'ROOMS_INIT_CREATE',
  ROOMS_HANDLE_CREATE = 'ROOMS_HANDLE_CREATE',
  ROOMS_INIT_ADMIN_CHANGE = 'ROOMS_INIT_ADMIN_CHANGE',
  ROOMS_CHECK_PASSWORD = 'ROOMS_CHECK_PASSWORD',
  ROOMS_CHECK_PASSWORD_FAILURE = 'ROOMS_CHECK_PASSWORD_FAILURE',
  ROOMS_INIT_ENTER_SUCCESS = 'ROOMS_INIT_ENTER_SUCCESS',
}

enum canvas {
  CANVAS_SET_CURRENT_DRAWING = 'CANVAS_SET_CURRENT_DRAWING',
  CANVAS_INIT_CANVAS_TO_IMAGE = 'CANVAS_INIT_CANVAS_TO_IMAGE',
  CANVAS_GET_IMAGES_FROM_SERVER = 'CANVAS_GET_IMAGES_FROM_SERVER',
  CANVAS_SET_USER_DRAWINGS = 'CANVAS_SET_USER_DRAWINGS',
  CANVAS_INIT_CREATE_NEW_DRAWING = 'CANVAS_INIT_CREATE_NEW_DRAWING',
  CANVAS_INIT_DRAWING_SELECT = 'CANVAS_INIT_DRAWING_SELECT',
  CANVAS_INIT_IN_ROOM_DRAWING_SELECT = 'CANVAS_INIT_IN_ROOM_DRAWING_SELECT',
  CANVAS_SET_IS_MOUSE_DOWN = 'CANVAS_SET_IS_MOUSE_DOWN',
  CANVAS_SET_GROUP_COUNT = ' CANVAS_SET_GROUP_COUNT',
  CANVAS_CREATE_DRAWING_POINT = 'CANVAS_CREATE_DRAWING_POINT',
  CANVAS_SET_DRAWING_POINT = 'CANVAS_SET_DRAWING_POINT',
  CANVAS_SET_LATEST_POINT = 'CANVAS_SET_LATEST_POINT',
  CANVAS_SET_BROADCASTED_DRAWING_POINT = 'CANVAS_SET_BROADCASTED_DRAWING_POINT',
  CANVAS_SET_BROADCASTED_DRAWING_POINTS_GROUP = 'CANVAS_SET_BROADCASTED_DRAWING_POINTS_GROUP',
  CANVAS_SET_BROADCASTED_DRAWING_POINTS_BULK = 'CANVAS_SET_BROADCASTED_DRAWING_POINTS_BULK',
  CANVAS_SET_DRAWING_POINTS_CACHE = 'CANVAS_SET_DRAWING_POINTS_CACHE',
  CANVAS_CLEAR_DRAWING_POINTS = 'CANVAS_CLEAR_DRAWING_POINTS',
  CANVAS_RESET_DRAWING = 'CANVAS_RESET_DRAWING',
  CANVAS_CLEAR = 'CANVAS_CLEAR',
  CANVAS_INIT_DRAW = 'CANVAS_INIT_DRAW',
  CANVAS_DRAW = 'CANVAS_DRAW',
  CANVAS_GET_DRAWING_POINTS = 'CANVAS_GET_DRAWING_POINTS',
  CANVAS_SET_WEIGHT = 'CANVAS_SET_WEIGHT',
  CANVAS_SET_FILL = 'CANVAS_SET_FILL',
}

enum socket {
  SOCKET_SET_CONNECTION_STATUS = 'SET_SOCKET_CONNECTION_STATUS',
  SOCKET_BIND_HANDLERS = 'SOCKET_BIND_HANDLERS',
  SOCKET_BIND_ROOM_HANDLERS = 'SOCKET_BIND_ROOM_HANDLERS',
  SOCKET_UNBIND_ROOM_HANDLERS = 'SOCKET_UNBIND_ROOM_HANDLERS',
  SOCKET_CLOSE = 'SOCKET_CLOSE',
  SOCKET_EMIT_ROOM_DRAW = 'SOCKET_EMIT_ROOM_DRAW',
  SOCKET_EMIT_ROOM_DRAW_CHANGE = 'SOCKET_EMIT_ROOM_DRAW_CHANGE',
  SOCKET_EMIT_ROOM_DRAW_MOUSEUP = ' SOCKET_EMIT_ROOM_DRAW_MOUSEUP',
  SOCKET_EMIT_ROOM_DRAW_RESET = ' SOCKET_EMIT_ROOM_DRAW_RESET',
  SOCKET_EMIT_ROOM_SET_ADMIN = 'SOCKET_EMIT_ROOM_SET_ADMIN',
  SOCKET_EMIT_ROOM_CREATE = 'SOCKET_EMIT_ROOM_CREATE',
  SOCKET_EMIT_GENERAL_MESSAGE = 'SOCKET_EMIT_GENERAL_MESSAGE',
  SOCKET_EMIT_MESSAGE_WRITE = 'SOCKET_EMIT_MESSAGE_WRITE',
  SOCKET_EMIT_ROOM_MESSAGE = 'SOCKET_EMIT_ROOM_MESSAGE',
  SOCKET_EMIT_INBOX_MESSAGE = 'SOCKET_EMIT_INBOX_MESSAGE',
}

export const types = {
  ...global,
  ...user,
  ...messages,
  ...rooms,
  ...canvas,
  ...socket,
};
