import * as React from 'react';
import styled from 'styled-components';
import { CirclePicker } from 'react-color';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Slider from '@material-ui/lab/Slider';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';

import { CombinedProps } from './index';

import { ButtonIcon, GradientButton, HeadlineIcon } from './../../../styles';

const WeightSlider = styled.div`
  margin: 0 3rem;
`;

const ModalPaper = styled(Paper)`
  max-width: 600px;
  margin: 0 auto;
  margin-top: 7rem;
`;

const GridWithPadding = styled(Grid)`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const ListWithWidth = styled(List)`
  width: 85%;
`;

export const CanvasNavbarComponent = ({
  setSelectedColor,
  handleResetBtn,
  isUserAdmin,
  user,
  users,
  rooms,
  handleLoadImage,
  isModalOpen,
  closeModal,
  openModal,
  sendInvitationLink,
  isColorPickerOpen,
  toggleColorPicker,
  setWeight,
  weight,
}: CombinedProps) => {
  if (!rooms.active) return <p>...loading</p>;

  const userList = Object.keys(users.general);

  return (
    <>
      <nav>
        {isUserAdmin(user.id) && (
          <>
            <Button onClick={handleLoadImage}>Load Image</Button>
            <Button onClick={handleResetBtn}>Reset</Button>
          </>
        )}
        <Button onClick={toggleColorPicker}>Tools</Button>
        <Button onClick={openModal}> Invite friend</Button>
      </nav>

      <ExpansionPanel expanded={isColorPickerOpen}>
        <ExpansionPanelDetails>
          <CirclePicker onChangeComplete={setSelectedColor} />
          <WeightSlider>
            <Slider
              value={weight}
              min={1}
              max={8}
              step={1}
              onChange={setWeight}
              vertical={true}
            />
          </WeightSlider>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <Modal
        aria-labelledby="invitation-modal"
        aria-describedby="invite friends"
        open={isModalOpen}
        onClose={closeModal}
      >
        <ModalPaper>
          <Grid container={true} alignItems="center">
            <HeadlineIcon>people</HeadlineIcon>
            <Typography variant="h5">Select User to invite</Typography>
          </Grid>
          <GridWithPadding container={true} justify="center">
            {userList.length > 1 ? (
              <ListWithWidth>
                {userList
                  .filter(id => Number(id) !== user.id)
                  .map(id => (
                    <ListItem key={id} data-id={id}>
                      <ListItemAvatar>
                        <Avatar>
                          <Icon>account_circle</Icon>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={users.general[id]} />
                      {!users.selectedRoom[id] ? (
                        <GradientButton
                          variant="contained"
                          color="primary"
                          onClick={sendInvitationLink}
                        >
                          Send Invitation
                        </GradientButton>
                      ) : (
                        <p>this user is in room already</p>
                      )}
                    </ListItem>
                  ))}
              </ListWithWidth>
            ) : (
              <Typography variant="h6" align="center">
                No other users found.
              </Typography>
            )}
          </GridWithPadding>
          <Grid container={true} justify="flex-end">
            <GradientButton
              variant="contained"
              color="secondary"
              onClick={closeModal}
            >
              Close
              <ButtonIcon>close</ButtonIcon>
            </GradientButton>
          </Grid>
        </ModalPaper>
      </Modal>
    </>
  );
};
