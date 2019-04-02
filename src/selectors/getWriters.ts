import { createSelector } from 'reselect';
import { State } from './../store/interfaces';

const getUsers = (state: State) => state.users.general;
const getWritersById = (state: State) => state.chats.writersById;

export const getWriters = createSelector(
  [getUsers, getWritersById],
  (users, writersById) => writersById.map(id => users.general[Number(id)]),
);
