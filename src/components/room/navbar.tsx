import React, { ComponentType } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { compose, withHandlers } from "recompose";
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { actions } from '../../actions';
import { State, Rooms, UserData } from "../../store";

export interface InvitationData {
    roomId: number;
    senderId: number;
    receiverId: number;
}

interface Params {
    id: string;
}

interface Props extends RouteComponentProps<Params> {
    rooms: Rooms;
    user: UserData
    isUserAdmin: (itm: number) => boolean;
    handleLoadImage: () => void;
    sendInvitationLink: () => void;
    initSendRoomInvitation: (data: InvitationData) => Dispatch;
}

interface PassedProps {
    setSelectedColor: (e: any) => void;
    handleResetBtn: () => void;
    setIsImageSelectorOpen: (v?: boolean) => void;
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
        const receiverId = Number(prompt('receiverId?'));

        props.initSendRoomInvitation({ roomId, senderId, receiverId });
    }
};

export const CanvasNavbarComponent: ComponentType<Props & PassedProps> = (props) => {
    const { setSelectedColor, handleResetBtn, isUserAdmin, user,
        handleLoadImage, sendInvitationLink } = props;

    if (!props.rooms.active) return (<p>...loading</p>);

    return (
        <nav>
            {isUserAdmin(user.id) && <React.Fragment>
                <button onClick={handleLoadImage}>Load Image</button>
                <button onClick={handleResetBtn}>Reset</button>
                <button>TODO</button>
                <button>next</button>
            </React.Fragment>}
            <input type="color" onChange={setSelectedColor} />
            <button onClick={sendInvitationLink}>Invite friend</button>
        </nav>
    );
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
