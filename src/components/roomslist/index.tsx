import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { push } from 'connected-react-router';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';

import { FullHeightPaper, HeadlineIcon, GradientButton } from './../../styles';

import { State, Rooms } from './../../store/interfaces';

interface Props {
  rooms: Rooms;
  goToCreateRoom: () => void;
  handleRoomClick: (e: any) => void;
  pushRouter: (v: string) => Dispatch;
}

const handlers = {
  goToCreateRoom: (props: Props) => () => {
    props.pushRouter('/room/create');
  },
  handleRoomClick: (props: Props) => (e: any) => {
    const id = e.target.closest('li').dataset.id;

    props.pushRouter(`/room/${id}`);
  },
};

const ListWrapper = styled.div`
  height: calc(100% - 80px);
  overflow: auto;
`;

const marginLeft = { marginLeft: '.5rem' };

export const RoomsList = compose<Props, {}>(
  connect(
    ({ rooms }: State) => ({ rooms }),
    { pushRouter: push },
  ),
  withHandlers(handlers),
)(({ rooms, handleRoomClick, goToCreateRoom }: Props) => (
  <FullHeightPaper>
    <Grid container={true} alignItems="center">
      <HeadlineIcon>group_work</HeadlineIcon>
      <Typography variant="h4">Available Rooms</Typography>
    </Grid>
    <ListWrapper>
      <List>
        {rooms.list && Object.keys(rooms.list).length ? (
          Object.keys(rooms.list).map(itm => (
            <ListItem
              key={itm}
              data-id={itm}
              onClick={handleRoomClick}
              button={true}
              component="li"
            >
              <ListItemIcon>
                <Icon>supervisor_account</Icon>
              </ListItemIcon>
              <ListItemText
                primary={rooms.list[itm].name}
                secondary={rooms.list[itm].isPrivate ? 'private' : 'public'}
              />
            </ListItem>
          ))
        ) : (
          <ListItem key={0}>
            <ListItemText primary="No rooms available. Create one using button below." />
          </ListItem>
        )}
      </List>
    </ListWrapper>
    <GradientButton
      variant="contained"
      color="secondary"
      onClick={goToCreateRoom}
    >
      Create new room
      <Icon style={marginLeft}>create</Icon>
    </GradientButton>
  </FullHeightPaper>
));
