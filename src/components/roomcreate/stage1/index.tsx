import * as React from "react";
import { compose } from "recompose";

import { IState } from "./../index";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";

interface Props {}

interface PassedProps {
  state: IState;
  setIsPrivate: () => void;
  setName: () => void;
  setPassword: () => void;
  goToNextStage: () => void;
}

type CombinedProps = Props & PassedProps;

export const RoomCreateFormComponent = ({
  state,
  setName,
  setPassword,
  setIsPrivate,
  goToNextStage
}: CombinedProps) => {
  return (
    <main id="roomcreate" className="container">
      <Grid container={true} spacing={16}>
        <Grid item={true} xs={12}>
          <Paper className="paper">
            <Typography variant="display1" align="center">
              Create new Room
            </Typography>
            <Grid
              item={true}
              xs={6}
              className="griditem--center mtop--2 mbottom--2"
            >
              <FormControl fullWidth={true} margin="normal">
                <FormControl margin="dense">
                  <InputLabel htmlFor="name">Name</InputLabel>
                  <Input
                    id="name"
                    placeholder="Name"
                    value={state.name}
                    onChange={setName}
                  />
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={state.isPrivate}
                      onChange={setIsPrivate}
                      color="secondary"
                    />
                  }
                  label="is Room Private?"
                />
                <FormControl margin="dense">
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="password"
                    placeholder="Password"
                    value={state.password!}
                    onChange={setPassword}
                    disabled={!state.isPrivate}
                  />
                </FormControl>
                <Grid container={true} justify="flex-end">
                  <Button
                    onClick={goToNextStage}
                    variant="contained"
                    color="primary"
                    className="mtop--1"
                    disabled={!state.name.length}
                  >
                    Next
                    <Icon className="icon--mleft">arrow_right_alt</Icon>
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
};

export const RoomCreateForm = RoomCreateFormComponent;