import React, { ComponentType, Fragment } from "react";
import './style.scss';

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
import Icon from '@material-ui/core/Icon';
import { CirclePicker } from 'react-color';

import { Props, PassedProps } from './index';

export const CanvasNavbarComponent: ComponentType<Props & PassedProps> = ({
    setSelectedColor, handleResetBtn, isUserAdmin, user, users, rooms, handleLoadImage,
    isModalOpen, closeModal, openModal, sendInvitationLink, isColorPickerOpen,
    toggleColorPicker, setWeight, weight }) => {

    if (!rooms.active) return (<p>...loading</p>);

    const userList = Object.keys(users.general);

    return (<Fragment>
        <nav>
            {isUserAdmin(user.id) && <Fragment>
                <Button onClick={handleLoadImage}>Load Image</Button>
                <Button onClick={handleResetBtn}>Reset</Button>
                <Button>TODO</Button>
                <Button>next</Button>
            </Fragment>}
            <Button onClick={toggleColorPicker}>Tools</Button>
            <Button onClick={openModal}> Invite friend</Button>
        </nav>

        <ExpansionPanel expanded={isColorPickerOpen}>
            <ExpansionPanelDetails >
                <CirclePicker onChangeComplete={setSelectedColor} />
                <div className="weightslider">
                    <Slider value={weight} min={0} max={8} step={1} onChange={setWeight} vertical />
                </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>

        <Modal
            aria-labelledby="invitation-modal"
            aria-describedby="invite friends"
            open={isModalOpen}
            onClose={closeModal}
        >
            <div>
                <Paper className="paper modal">
                    <Typography variant="title" align="center" className="mbottom-2">
                        Select User to invite
                    </Typography>
                    {userList.length > 1 ?
                        <List className="mbottom-2">
                            {userList
                                .filter(id => Number(id) !== user.id)
                                .map(id => (
                                    <ListItem key={id} data-id={id}>
                                        <ListItemText primary={users.general[id]} />
                                        <Button variant="contained" color="primary"
                                            onClick={sendInvitationLink}>Send Invitation</Button>
                                    </ListItem>))}
                        </List> :
                        <Typography variant="title" align="center" className="mbottom-2">
                            No other users found.
                        </Typography>}
                    <div className="width-100">
                        <Button variant="contained" color="secondary" className="btn-hcenter"
                            onClick={closeModal}>Close
                            <Icon className="icon--mleft">close</Icon></Button>
                    </div>
                </Paper>
            </div>
        </Modal>
    </Fragment>);
};
