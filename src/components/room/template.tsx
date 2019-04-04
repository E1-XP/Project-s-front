import * as React from 'react';
import { Prompt, Link } from 'react-router-dom';

import { Props } from './index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { MainContainer, GradientButton } from './../../styles';

import { RoomDashboard } from './dashboard';
import { Canvas } from '../canvas';
import { Chat } from '../chat';

const NoRoomPlaceholder = () => (
  <MainContainer>
    <Grid container={true} spacing={16}>
      <Grid item={true} xs={12}>
        <Paper>
          <Typography variant="h5" align="center" className="mbottom-2">
            Room not exist
          </Typography>
          <Typography variant="subtitle1" align="center" className="mbottom-2">
            Probably admin closed it or you entered incorrect url.
          </Typography>
          <Grid container={true} item={true} md={12} justify="center">
            <Link to="/dashboard">
              <GradientButton variant="contained" color="primary">
                Return to the main page
              </GradientButton>
            </Link>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  </MainContainer>
);

export const RoomComponent = ({
  match,
  changeRoomOwner,
  isUserAdmin,
  isRoomUndefined,
  handleSubmit,
  chats,
  user,
}: Props) => {
  if (isRoomUndefined()) {
    return <NoRoomPlaceholder />;
  }
  console.log('rendering');

  return (
    <MainContainer>
      <Grid container={true} spacing={16}>
        <Grid item={true} md={3} sm={12}>
          <Grid item={true} xs={12} className="mbottom-1">
            <RoomDashboard
              match={match}
              changeRoomOwner={changeRoomOwner}
              isUserAdmin={isUserAdmin}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <Paper>
              <Typography variant="h5">Room chat</Typography>
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
    </MainContainer>
  );
};
