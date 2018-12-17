import * as React from "react";

import "./style.scss";

import { Props } from "./index";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

export const InboxComponent = ({ user, users, rooms, pushRouter }: Props) => {
  const addZero = (num: number) => (num < 10 ? `0${num}` : num);
  const dateFormat = (d: Date) =>
    `${d.getFullYear()}.${addZero(d.getMonth() + 1)}.${addZero(d.getDate())}`;

  const pushToRoom = (e: any) =>
    pushRouter(`/room/${e.target.closest("button").dataset.id}`);

  return (
    <main id="inbox" className="container">
      <Grid container={true} spacing={16}>
        <Grid item={true} xs={12}>
          <Paper className="paper">
            <Typography variant="display1" align="center" className="mbottom-2">
              Inbox
            </Typography>
            <Grid container={true} justify="center">
              <Grid item={true} md={9}>
                <div className="inbox__content">
                  {user.inboxMessages ? (
                    user.inboxMessages.length ? (
                      <List>
                        {user.inboxMessages.map((itm, i) => (
                          <ListItem key={i}>
                            <ListItemText
                              primary={`${dateFormat(new Date(itm.updatedAt))} :
                                                 ${
                                                   itm.senderName
                                                 } send you invitation link to enter
                    room ${
                      rooms[itm.roomId] ? rooms[itm.roomId].name : "[closed]"
                    }`}
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              data-id={itm.roomId}
                              onClick={pushToRoom}
                              disabled={!rooms[itm.roomId]}
                            >
                              Enter
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      `You don't received any messages yet`
                    )
                  ) : (
                    "loading..."
                  )}
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
};
