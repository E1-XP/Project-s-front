import React from 'react';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';

import { HeadlineIcon, FullHeightPaper } from './../../styles';

import { Users, UserData } from './../../store/interfaces';

interface Props {
  users: Users;
  user: UserData;
}

const ListWrapper = styled.div`
  height: 90%;
  overflow: auto;
`;

export const UsersList = ({ users, user }: Props) => (
  <FullHeightPaper>
    <Grid container={true} alignItems="center">
      <HeadlineIcon>people</HeadlineIcon>
      <Typography variant="h4">
        Currently online: {Object.keys(users.general).length}
      </Typography>
    </Grid>
    <ListWrapper>
      <List>
        {Object.keys(users.general).map((key: string) => (
          <ListItem key={key}>
            <ListItemAvatar>
              <Avatar>
                <Icon>account_circle</Icon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={users.general[key]}
              primaryTypographyProps={{
                color:
                  key === user!.id!.toString() ? 'primary' : ('default' as any),
                style: {
                  fontWeight: key === user!.id!.toString() ? 600 : 'inherit',
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </ListWrapper>
  </FullHeightPaper>
);
