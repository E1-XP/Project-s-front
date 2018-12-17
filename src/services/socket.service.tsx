import io from "socket.io-client";
import { push } from "connected-react-router";

import { store } from "../store";
import { actions } from "../actions";

const URL = "http://localhost:3001";

export let Socket: SocketIOClient.Socket | undefined;

export const startSocketService = async (v: any): Promise<any> => {
  return new Promise(async (res, rej) => {
    const { username, id } = v.payload.value.data;
    // if (!data.payload.email || !data.payload.email.length) return null;

    Socket = await io(URL, { query: `user=${username}&id=${id}` });

    Socket.on("general/users", (data: string[]) =>
      store.dispatch(actions.users.setUsers(data))
    );

    Socket.on("general/messages", (data: any) => {
      store.dispatch(
        actions.chats.setMessages({
          data,
          channel: "general"
        })
      );
    });

    Socket.on("inbox/get", (data: any) => {
      console.log("fetched inbox");
      store.dispatch(actions.user.setInboxMessages(data));
    });

    Socket.on("inbox/new", (data: any) => {
      store.dispatch(actions.user.setInboxMessages(data));
      console.log("received data inbox ", data);

      store.dispatch(actions.user.initReceiveInboxMessage());
    });

    Socket.on("rooms/get", (data: any) => {
      store.dispatch(actions.rooms.setRooms(data));
    });

    Socket.on("room/create", (id: string) => {
      console.log("ROOM CREATE GET");
      store.dispatch(actions.rooms.initHandleRoomCreate(id));
    });

    Socket.on("connect", () => {
      console.log("CONNECTED!");
      store.dispatch(actions.global.setSocketConnectionStatus(true));
      res(v);
    });
  });
};
