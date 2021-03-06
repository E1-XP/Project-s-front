import * as React from 'react';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { actions } from '../../actions';
import { State } from '../../store/interfaces';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { MainContainer } from '../../styles';

import { withAuthentication } from '../../HOCs/withAuthentication';

interface Props {
  handleSubmit: (e: any) => void;
  initCheckRoomPassword: (v: string) => Dispatch;
  password: string;
  setPassword: (v: string) => void;
  onPasswordChange: (e: any) => void;
  formMessage: string;
  setFormMessage: (s: string) => void;
}

const mSTP = ({ global, rooms }: State) => ({
  rooms,
  formMessage: global.formMessage,
});

const mDTP = (dispatch: Dispatch) => ({
  initCheckRoomPassword: (data: string) =>
    dispatch(actions.rooms.initCheckRoomPassword(data)),
  setFormMessage: (v: string) => dispatch(actions.global.setFormMessage(v)),
});

const minHeight = { minHeight: '21px' };
const marginTop = { marginTop: '1rem' };

export const RoomPasswordScreen = compose<Props, {}>(
  withRouter,
  connect(mSTP, mDTP),
  withState('password', 'setPassword', ''),
  withHandlers({
    handleSubmit: (props: Props) => (e: any) => {
      e.preventDefault();
      props.initCheckRoomPassword(props.password);
    },
    onPasswordChange: (props: Props) => (e: any) => {
      if (props.formMessage) props.setFormMessage('');
      props.setPassword(e.target.value);
    },
  }),
  lifecycle<Props, {}>({
    componentWillUnmount() {
      this.props.setFormMessage('');
    },
  }),
  withAuthentication,
)(({ handleSubmit, password, onPasswordChange, formMessage }: Props) => (
  <MainContainer>
    <Grid container={true} justify="center" alignItems="center">
      <Grid item={true} sm={6} xs={12}>
        <Paper>
          <Typography align="center" variant="h4">
            Enter password
          </Typography>
          <Grid
            style={marginTop}
            container={true}
            spacing={16}
            justify="center"
          >
            <Grid item={true} md={6} sm={7} xs={10}>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth={true}>
                  <TextField
                    type="password"
                    label="password"
                    name="password"
                    margin="dense"
                    variant="outlined"
                    required={true}
                    value={password}
                    onChange={onPasswordChange}
                  />
                  <Typography
                    align="center"
                    style={minHeight}
                    variant="subtitle2"
                    color="error"
                  >
                    {formMessage}
                  </Typography>
                  <Button
                    type="submit"
                    disabled={!password.length}
                    variant="contained"
                    color="primary"
                    fullWidth={true}
                  >
                    Submit
                  </Button>
                </FormControl>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  </MainContainer>
));

export default RoomPasswordScreen;
