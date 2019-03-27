import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { Chat } from '../chat';
import { UsersList } from '../userslist';
import { RoomsList } from '../roomslist';

import { Props } from './index';

import { MainContainer, HeadlineIcon } from './../../styles';

export const DashboardComponent = ({
  handleMessageSubmit,
  users,
  messages,
}: Props) => (
  <MainContainer>
    <Grid container={true} spacing={16}>
      <Grid container={true} item={true} spacing={16} md={6} xs={12}>
        <Grid item={true} xs={12}>
          <UsersList users={users} />
        </Grid>
        <Grid item={true} xs={12}>
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
