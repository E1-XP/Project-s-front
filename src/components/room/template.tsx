import * as React from 'react';
import { Prompt, Link } from 'react-router-dom';
import './style.scss';

import { Props } from './index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import { Canvas } from '../canvas';
import { Chat } from '../chat';

export const RoomComponent = ({
  changeRoomOwner,
  isUserAdmin,
  handleSubmit,
  isSocketConnected,
  setMessage,
  user,
  users,
  rooms,
  chats,
  message,
  match,
  isRoomUndefined,
}: Props) => {
  if (isRoomUndefined()) {
    return (
      <main id="room" className="container">
        <Grid container={true} spacing={16}>
          <Grid item={true} xs={12}>
            <Paper>
              <Typography
                variant="headline"
                align="center"
                className="mbottom-2"
              >
                Room not exist
              </Typography>
              <Typography
                variant="subheading"
                align="center"
                className="mbottom-2"
              >
                Probably admin closed it or you entered incorrect url.
              </Typography>
              <Grid container={true} item={true} md={12} justify="center">
                <Link to="/dashboard">
                  <Button variant="contained" color="primary">
                    Return to the main page
                  </Button>
                </Link>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </main>
    );
  }

  return (
    <main id="room" className="container">
      <Grid container={true} spacing={16}>
        <Grid item={true} md={3} sm={12}>
          <Grid item={true} xs={12} className="mbottom-1">
            <Paper>
              <Typography variant="headline">
                Room {rooms.list[match.params.id].name}
              </Typography>
              <Typography variant="headline">
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
          </Grid>
          <Grid item={true} xs={12}>
            <Paper>
              <Typography variant="headline">Room chat</Typography>
              <Chat messages={chats.selectedRoom} handleSubmit={handleSubmit} />
            </Paper>
          </Grid>
        </Grid>
        <Grid item={true} md={9} sm={12}>
          <Paper>
            <Canvas />
          </Paper>
        </Grid>
      </Grid>

      <Prompt
        when={isUserAdmin(user.id)}
        message={'Are you want to leave? This will close your room.'}
      />
    </main>
  );
};
