import * as React from "react";
import "./style.scss";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";

import { Chat } from "../chat";

import { Props } from "./index";

export const DashboardComponent = ({
  handleMessageSubmit,
  handleRoomClick,
  goToCreateRoom,
  users,
  rooms,
  messages
}: Props) => {
  return (
    <main id="dashboard" className="container">
      <Grid container={true} spacing={16}>
        <Grid item={true} md={6} container={true} sm={12}>
          <Grid item={true} xs={12} className="mbottom-1">
            <Paper className="paper">
              <Typography variant="headline">
                Currently online: {Object.keys(users.general).length}
              </Typography>
              <List>
                {Object.keys(users.general).map((key: string) => (
                  <ListItem key={key}>
                    <ListItemText primary={users.general[key]} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item={true} xs={12}>
            <Paper className="paper">
              <Typography variant="headline">Available Rooms</Typography>
              <List>
                {rooms.list && Object.keys(rooms.list).length ? (
                  Object.keys(rooms.list).map(itm => (
                    <ListItem key={itm} data-id={itm} onClick={handleRoomClick}>
                      <ListItemText primary={rooms.list[itm].name} />
                      {rooms.list[itm].isPrivate && (
                        <ListItemText secondary={"private"} />
                      )}
                    </ListItem>
                  ))
                ) : (
                  <ListItem key={0}> no rooms created </ListItem>
                )}
              </List>
              <Button
                variant="contained"
                color="primary"
                onClick={goToCreateRoom}
              >
                Create new room
                <Icon className="icon--mleft">create</Icon>
              </Button>
            </Paper>
          </Grid>
        </Grid>
        <Grid item={true} md={6} xs={12}>
          <Paper className="paper--double">
            <Typography variant="headline">General chat</Typography>
            <Chat messages={messages} handleSubmit={handleMessageSubmit} />
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
};
