import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { push } from 'connected-react-router';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import { FullHeightPaper, HeadlineIcon } from './../../styles';

import { actions } from './../../actions';
const {} = actions;
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

const mSTP = ({ rooms }: State) => ({ rooms });
const mDTP = { pushRouter: push };

export const RoomsList = compose<Props, {}>(
  connect(
    mSTP,
    mDTP,
  ),
  withHandlers(handlers),
)(({ rooms, handleRoomClick, goToCreateRoom }: Props) => (
  <FullHeightPaper>
    <Grid container={true} alignItems="center">
      <HeadlineIcon>group_work</HeadlineIcon>
      <Typography variant="h4">Available Rooms</Typography>
    </Grid>
    <List>
      {rooms.list && Object.keys(rooms.list).length ? (
        Object.keys(rooms.list).map(itm => (
          <ListItem key={itm} data-id={itm} onClick={handleRoomClick}>
            <ListItemText primary={rooms.list[itm].name} />
            {rooms.list[itm].isPrivate && (
              <ListItemText secondary={'private'} />
            )}
          </ListItem>
        ))
      ) : (
        <ListItem key={0}> no rooms created </ListItem>
      )}
    </List>
    <Button variant="contained" color="secondary" onClick={goToCreateRoom}>
      Create new room
      <Icon>create</Icon>
    </Button>
  </FullHeightPaper>
));
