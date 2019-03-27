import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';

import { HeadlineIcon, FullHeightPaper } from './../../styles';

import { Users } from './../../store/interfaces';

interface Props {
  users: Users;
}

export const UsersList = ({ users }: Props) => (
  <FullHeightPaper>
    <Grid container={true} alignItems="center">
      <HeadlineIcon>people</HeadlineIcon>
      <Typography variant="h4">
        Currently online: {Object.keys(users.general).length}
      </Typography>
    </Grid>
    <List>
      {Object.keys(users.general).map((key: string) => (
        <ListItem key={key}>
          <ListItemAvatar>
            <Avatar>
              <Icon>account_circle</Icon>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={users.general[key]} />
        </ListItem>
      ))}
    </List>
  </FullHeightPaper>
);
