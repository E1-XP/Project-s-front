import * as React from 'react';

import { IState } from '../index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { MainContainer, GradientButton, ButtonIcon } from '../../../styles';
import { Heading } from '../../../components/shared/heading';

interface Props {}

interface PassedProps {
  state: IState;
  setIsPrivate: () => void;
  setName: () => void;
  setPassword: () => void;
  goToNextStage: () => void;
}

type CombinedProps = Props & PassedProps;

const height500 = { height: '500px' };

export const RoomCreateForm = ({
  state,
  setName,
  setPassword,
  setIsPrivate,
  goToNextStage,
}: CombinedProps) => {
  const shouldGoToNextStep =
    state.name.length && (!state.isPrivate || state.password!.length);

  return (
    <MainContainer>
      <Grid container={true} spacing={16}>
        <Grid item={true} xs={12}>
          <Paper>
            <Heading justify="center" icon="create" text="Create new Room" />
            <Grid container={true} justify="center" style={height500}>
              <Grid item={true} xs={9} md={6}>
                <FormControl fullWidth={true} margin="normal">
                  <FormControl margin="dense">
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <Input
                      id="name"
                      placeholder="Name"
                      value={state.name}
                      onChange={setName}
                      inputProps={{ maxLength: 18 }}
                    />
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state.isPrivate}
                        onChange={setIsPrivate}
                        color="primary"
                      />
                    }
                    label="is Room Private?"
                  />
                  <FormControl margin="dense">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                      type="password"
                      id="password"
                      placeholder="Password"
                      value={state.password!}
                      onChange={setPassword}
                      disabled={!state.isPrivate}
                    />
                  </FormControl>
                  <Grid container={true} justify="flex-end">
                    <GradientButton
                      onClick={goToNextStage}
                      variant="contained"
                      color="primary"
                      disabled={!shouldGoToNextStep}
                    >
                      Next
                      <ButtonIcon>arrow_right_alt</ButtonIcon>
                    </GradientButton>
                  </Grid>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </MainContainer>
  );
};
