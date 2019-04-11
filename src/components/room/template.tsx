import * as React from 'react';
import { Prompt, Link } from 'react-router-dom';
import styled from 'styled-components';

import { Props } from './index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { MainContainer, GradientButton } from './../../styles';

import { RoomDashboard } from './dashboard';
import { Canvas } from '../canvas';
import { Chat } from '../chat';

const GridWithPadding = styled(Grid)`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const NoRoomPlaceholder = () => (
  <MainContainer>
    <Grid container={true} spacing={16}>
      <Grid item={true} xs={12}>
        <Paper>
          <Typography variant="h5" align="center" className="mbottom-2">
            Room not exist
          </Typography>
          <GridWithPadding container={true} justify="center">
            <Typography variant="subtitle1">
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

const OuterGrid = styled(Grid)`
  @media only screen and (max-width: 1280px) {
    margin: 0 auto !important;
  }
  @media only screen and (min-width: 960px) and (max-width: 1280px) {
    & > div:first-of-type {
      padding-right: 8px !important;
    }
    & > div:last-of-type {
      padding-left: 8px !important;
    }
  }

  @media only screen and (max-width: 960px) {
    & > div:first-of-type {
      padding-bottom: 8px !important;
    }
    & > div:last-of-type {
      padding-top: 8px !important;
    }
  }
`;

const NestedGrid = styled(Grid)`
  @media only screen and (max-width: 1280px) {
    padding: 0 !important;
  }
`;

const GridWithWidth = styled(Grid)`
  width: 100% !important;
`;

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
        message={'Are you want to leave? This will close your room.'}
      />
    </MainContainer>
  );
};
