import { RouterState } from 'connected-react-router';

interface DBItem {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  username: string;
  email: string;
  id: number | null;
}

export interface User {
  userData: UserData;
  drawings: DrawingObject[] | null;
  inboxMessages: InboxMessage[];
  inboxCount: number;
}

export interface InboxMessage extends DBItem {
  roomId: number;
  senderId: number;
  senderName: string;
  receiverId: number;
}

export interface DrawingObject {
  id: number;
  name: String;
  creatorId: number;
}

export interface SelectedRoom {
  [key: string]: string;
}

export interface AllUsers {
  [key: string]: string;
}

export interface Users {
  general: AllUsers;
  selectedRoom: SelectedRoom;
}

export interface ChatMessage {
  author: string;
  message: string;
}

export interface Chats {
  general: ChatMessage[];
  selectedRoom: ChatMessage[];
  isWriting: boolean;
  writingIn: null | string;
  writersById: string[];
}

export interface Room {
  name: string;
  roomid: number;
  adminId: string;
  isPrivate: boolean;
}

export interface RoomsList {
  [key: string]: Room;
}

export interface DrawingPoint {
  x: number;
  y: number;
  fill: string;
  weight: number;
  date: number;
  group: number;
  userId: number;
  drawingId: number;
}

export interface BroadcastedDrawingPoints {
  [key: string]: DrawingPoint[][];
}

export interface Rooms {
  active: string;
  list: RoomsList;
}

export interface Canvas {
  currentDrawing: number | null;
  isMouseDown: boolean;
  groupCount: number;
  fill: string;
  weight: number;
  drawingPoints: DrawingPoint[][];
  broadcastedDrawingPoints: BroadcastedDrawingPoints;
  drawingPointsCache: DrawingPoint[][];
}

export interface Global {
  isLoading: boolean;
  isUserLoggedIn: boolean;
  isSocketConnected: boolean;
  formMessage: string;
}

export interface State {
  global: Global;
  user: User;
  users: Users;
  rooms: Rooms;
  chats: Chats;
  canvas: Canvas;
  router: RouterState;
}
