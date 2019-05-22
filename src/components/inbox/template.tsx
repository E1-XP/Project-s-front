import * as React from 'react';
import styled from 'styled-components';

import { Props } from './index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withTheme, WithTheme } from '@material-ui/core/styles';

import { Heading } from './../shared/heading';
import { PreloaderComponent } from './../preloader';

import { MainContainer, GradientButton, ButtonIcon } from './../../styles';

const InboxContent = styled.div`
  text-align: center;
  height: 500px;
  overflow-x: scroll;
`;

const UserSpan = withTheme()(styled.span<WithTheme>`
  color: ${({ theme }) => theme.palette.primary.main};
  font-weight: 600;
`);

const RoomSpan = styled.span`
  font-weight: 600;
`;

export const InboxComponent = ({
  user,
  users,
  rooms,
  pushToRoom,
  getDateFormat,
}: Props) => (
  <MainContainer>
    <Grid container={true} spacing={16}>
      <Grid item={true} xs={12}>
        <Paper>
          <Heading justify="center" text="Inbox" icon="inbox" />
          <Grid container={true} justify="center">
            <Grid item={true} md={9}>
              <InboxContent>
                {user.inboxMessages ? (
                  user.inboxMessages.length ? (
                    <List>
                      {user.inboxMessages
                        .sort((a, b) => b.id - a.id)
                        .map((itm, i) => (
                          <ListItem key={i}>
                            <ListItemText
                              disableTypography={true}
                              primary={
                                <Typography variant="body1">
                                  {`${getDateFormat(new Date(itm.updatedAt))}
                                 : user `}
                                  <UserSpan>{itm.senderName}</UserSpan>
                                  {` send you invitation link to enter room `}
                                  <RoomSpan>
                                    {rooms[itm.roomId]
                                      ? rooms[itm.roomId].name
                                      : '[closed]'}
                                  </RoomSpan>
                                </Typography>
                              }
                            />
                            <GradientButton
                              variant="contained"
                              data-id={itm.roomId}
                              onClick={pushToRoom}
                              disabled={!rooms[itm.roomId]}
                            >
                              Enter
                              <ButtonIcon>meeting_room</ButtonIcon>
                            </GradientButton>
                          </ListItem>
                        ))}
                    </List>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      align="center"
                    >{`You don't received any messages yet.`}</Typography>
                  )
                ) : (
                  <PreloaderComponent />
                )}
              </InboxContent>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  </MainContainer>
);
