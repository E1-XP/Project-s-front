import * as React from 'react';
import { compose, onlyUpdateForKeys } from 'recompose';
import { connect } from 'react-redux';
import { match } from 'react-router-dom';
import styled from 'styled-components';

import { State, Rooms, Users, UserData } from '../../store/interfaces';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';

import { Heading } from '../../components/shared/heading';
import { GradientButton, FullHeightPaper } from '../../styles';

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

const ListWrapper = styled.div`
  height: 90%;
  overflow: auto;
`;

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
    <FullHeightPaper>
      <Heading text={`${rooms.list[match.params.id].name}`} icon="people" />
      <Typography variant="h5">
        Currently online: {Object.keys(users.selectedRoom).length}
      </Typography>
      <ListWrapper>
        <List>
          {Object.keys(users.selectedRoom).map(id => (
            <ListItem key={id} data-id={id}>
              <ListItemAvatar>
                <Avatar>
                  <Icon>account_circle</Icon>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={users.general[id]}
                secondary={isUserAdmin(Number(id)) && 'admin'}
                primaryTypographyProps={{
                  color:
                    id === user!.id!.toString()
                      ? 'primary'
                      : ('default' as any),
                  style: {
                    fontWeight: id === user!.id!.toString() ? 600 : 'inherit',
                  },
                }}
              />
              {isUserAdmin(user.id) && !isUserAdmin(Number(id)) && (
                <GradientButton
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={changeRoomOwner}
                >
                  Set admin
                </GradientButton>
              )}
            </ListItem>
          ))}
        </List>
      </ListWrapper>
    </FullHeightPaper>
  ),
);
