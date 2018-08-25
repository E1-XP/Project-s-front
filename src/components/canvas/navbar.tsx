import React, { ComponentType, Fragment } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { compose, withHandlers } from "recompose";
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { actions } from '../../actions';
import { State, Rooms, UserData } from "../../store";

import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { CirclePicker } from 'react-color';

export interface InvitationData {
    roomId: number;
    senderId: number;
    senderName: string;
    receiverId: number;
}

interface Params {
    id: string;
}

interface Props extends RouteComponentProps<Params> {
    setState: (v: boolean) => void;
    rooms: Rooms;
    user: UserData
    isUserAdmin: (itm: number) => boolean;
    handleLoadImage: () => void;
    sendInvitationLink: () => void;
    initSendRoomInvitation: (data: InvitationData) => Dispatch;
    toggleColorPicker: () => void;
}

interface PassedProps {
    isColorPickerOpen: boolean;
    setSelectedColor: (e: any) => void;
    handleResetBtn: () => void;
    setIsImageSelectorOpen: (v?: boolean) => void;
    setIsColorPickerOpen: (v?: boolean) => void;
}

const handlers = {
    isUserAdmin: (props: Props) => (id: string) => {
        return id === props.rooms.list[props.match.params.id].adminId;
    },
    handleLoadImage: (props: Props & PassedProps) => () => {
        props.setIsImageSelectorOpen();
    },
    sendInvitationLink: (props: Props) => () => {
        const roomId = Number(props.match.params.id);
        const senderId = props.user.id;
        const senderName = props.user.username;
        const receiverId = Number(prompt('receiverId?'));

        props.initSendRoomInvitation({ roomId, senderId, senderName, receiverId });
    },
    toggleColorPicker: (props: Props & PassedProps) => () => {
        const value = !props.isColorPickerOpen;
        props.setIsColorPickerOpen(value);
    }
};

export const CanvasNavbarComponent: ComponentType<Props & PassedProps> = ({
    setSelectedColor, handleResetBtn, isUserAdmin, user, rooms, handleLoadImage,
    sendInvitationLink, isColorPickerOpen, toggleColorPicker }) => {

    if (!rooms.active) return (<p>...loading</p>);

    return (<Fragment>
        <nav>
            {isUserAdmin(user.id) && <Fragment>
                <Button onClick={handleLoadImage}>Load Image</Button>
                <Button onClick={handleResetBtn}>Reset</Button>
                <Button>TODO</Button>
                <Button>next</Button>
            </Fragment>}
            <Button onClick={toggleColorPicker}>Color Picker</Button>
            <Button onClick={sendInvitationLink}> Invite friend</Button>
        </nav>
        <ExpansionPanel expanded={isColorPickerOpen}>
            <ExpansionPanelDetails >
                <CirclePicker onChangeComplete={setSelectedColor} />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    </Fragment>);
};

const mapStateToProps = ({ user, rooms }: State) => ({
    user: user.userData,
    rooms
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    initSendRoomInvitation: (data: InvitationData) => dispatch(actions.user.initSendRoomInvitation(data))
});

export const CanvasNavbar = compose<Props, PassedProps>(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers(handlers)
)(CanvasNavbarComponent);
