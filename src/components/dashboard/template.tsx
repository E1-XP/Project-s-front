import React from 'react';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { Chat } from '../chat';
import { UsersList } from '../userslist';
import { RoomsList } from '../roomslist';

import { Props } from './index';

import { MainContainer, HeadlineIcon } from './../../styles';

const OuterGrid = styled(Grid)`
  min-height: 650px;
  margin: -8px auto !important;
`;

const NestedGrid = styled(Grid)`
  height: 50%;
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

export const DashboardComponent = ({
  handleMessageSubmit,
  users,
  messages,
  user,
}: Props) => (
  <MainContainer>
    <Grid container={true} spacing={16}>
      <OuterGrid container={true} item={true} spacing={16} md={6} xs={12}>
        <NestedGrid item={true} xs={12}>
          <UsersList users={users} user={user} />
        </NestedGrid>
        <NestedGrid item={true} xs={12}>
          <RoomsList />
        </NestedGrid>
      </OuterGrid>
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
