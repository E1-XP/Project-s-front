import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { Chat } from '../chat';
import { UsersList } from '../userslist';
import { RoomsList } from '../roomslist';

import { Props } from './index';

import { MainContainer, HeadlineIcon } from './../../styles';

const minHeightNoSidePadding = {
  minHeight: '650px',
};
const halfHeight = { height: '50%' };

export const DashboardComponent = ({
  handleMessageSubmit,
  users,
  messages,
  user,
}: Props) => (
  <MainContainer>
    <Grid container={true} spacing={16}>
      <Grid
        container={true}
        item={true}
        spacing={16}
        md={6}
        xs={12}
        style={minHeightNoSidePadding}
      >
        <Grid item={true} xs={12} style={halfHeight}>
          <UsersList users={users} user={user} />
        </Grid>
        <Grid item={true} xs={12} style={halfHeight}>
          <RoomsList />
        </Grid>
      </Grid>
      <Grid item={true} md={6} xs={12}>
        <Paper>
          <Grid container={true} alignItems="center">
            <HeadlineIcon>chat</HeadlineIcon>
            <Typography variant="h4">General chat</Typography>
          </Grid>
          <Chat messages={messages} handleSubmit={handleMessageSubmit} />
        </Paper>
      </Grid>
    </Grid>
  </MainContainer>
);
