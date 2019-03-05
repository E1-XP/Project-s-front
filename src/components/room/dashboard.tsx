import * as React from 'react';
import { compose, onlyUpdateForKeys } from 'recompose';
import { connect } from 'react-redux';
import { match } from 'react-router-dom';

import { State, Rooms, Users, UserData } from './../../store/interfaces';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

interface Params {
  id: string;
}

interface Props {
  rooms: Rooms;
  users: Users;
  user: UserData;
}

interface PassedProps {
  match: match<Params>;
  isUserAdmin: (itm: string | number | null, prevRooms?: Rooms) => boolean;
  changeRoomOwner: () => void;
}

type CombinedProps = Props & PassedProps;

export const RoomDashboard = compose<CombinedProps, PassedProps>(
  connect(({ rooms, users, user }: State) => ({
    rooms,
    users,
    user: user.userData,
  })),
  onlyUpdateForKeys(['rooms', 'users', 'user']),
)(
  ({
    rooms,
    users,
    match,
    isUserAdmin,
    changeRoomOwner,
    user,
  }: CombinedProps) => (
    <Paper>
      <Typography variant="h5">
        Room {rooms.list[match.params.id].name}
      </Typography>
      <Typography variant="h5">
        Currently online: {Object.keys(users.selectedRoom).length}
      </Typography>
      <List>
        {Object.keys(users.selectedRoom).map(id => (
          <ListItem key={id} data-id={id}>
            <ListItemText
              primary={users.general[id]}
              secondary={isUserAdmin(Number(id)) && 'admin'}
            />
            {isUserAdmin(user.id) && !isUserAdmin(Number(id)) && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={changeRoomOwner}
              >
                Set admin
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  ),
);
