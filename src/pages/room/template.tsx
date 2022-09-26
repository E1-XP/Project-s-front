import * as React from 'react';
import { Prompt, Link } from 'react-router-dom';

import { Props } from './index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { MainContainer, GradientButton } from '../../styles';
import { GridWithPadding, OuterGrid, NestedGrid, GridWithWidth } from './style';

import { RoomDashboard } from './dashboard';
import { Canvas } from '../../components/canvas';
import { Chat } from '../../components/chat';
import { Heading } from '../../components/shared/heading';

const NoRoomPlaceholder = () => (
  <MainContainer>
    <Grid container={true} spacing={16}>
      <Grid item={true} xs={12}>
        <Paper>
          <Heading
            justify="center"
            text="Room not exist"
            icon="remove_circle"
          />
          <GridWithPadding container={true} justify="center">
            <Typography variant="body1">
              Probably admin closed it or you entered incorrect url.
            </Typography>
          </GridWithPadding>

          <Grid container={true} justify="center">
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

  return (
    <MainContainer>
      <Grid container={true} spacing={16}>
        <OuterGrid
          container={true}
          item={true}
          spacing={16}
          md={12}
          sm={12}
          lg={3}
        >
          <NestedGrid item={true} xs={12} md={6} lg={12}>
            <RoomDashboard
              match={match}
              changeRoomOwner={changeRoomOwner}
              isUserAdmin={isUserAdmin}
            />
          </NestedGrid>
          <NestedGrid item={true} xs={12} md={6} lg={12}>
            <Chat
              messages={chats.selectedRoom}
              handleSubmit={handleSubmit}
              heading="Room chat"
              chatHeight="320px"
            />
          </NestedGrid>
        </OuterGrid>
        <GridWithWidth item={true} sm={12} md={12} lg={9}>
          <Paper>
            <Canvas />
          </Paper>
        </GridWithWidth>
      </Grid>

      <Prompt
        when={isUserAdmin(user.id)}
        message={'Are you sure? This will close your room.'}
      />
    </MainContainer>
  );
};
