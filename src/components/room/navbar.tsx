import React, { ComponentType, ComponentClass } from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { State, Rooms, UserData } from "../../store";

interface Params {
    id: string;
}

interface Props extends RouteComponentProps<Params> {
    rooms: Rooms;
    user: UserData
    handleSave: () => void;
    isUserAdmin: (itm: number) => boolean;
}

interface PassedProps {
    setSelectedColor: (e: any) => void;
    handleResetBtn: () => void;

}

const handlers = {
    isUserAdmin: (props: Props) => (itm: string) => {
        return itm === props.rooms.list[props.match.params.id].adminId;
    },
    handleSave: (props: Props) => (e: HTMLButtonElement) => {
        alert('ok');
    }
}

const CanvasNavbarComponent: ComponentType<Props & PassedProps> = (props) => {
    const { handleSave, setSelectedColor, handleResetBtn, isUserAdmin, user } = props;

    if (!props.rooms.active) return (<p>...loading</p>);

    return (
        <nav>
            {isUserAdmin(user.id) && <React.Fragment>
                <button onClick={null}>Load Image</button>
                <button onClick={handleResetBtn}>Reset</button>
                {/* <button onClick={handleSave}>Save</button> */}
                <button>back</button>
                <button>next</button>
            </React.Fragment>}
            <input type="color" onChange={setSelectedColor} />
        </nav>
    );
};

const mapStateToProps = ({ user, rooms }: State) => ({
    user: user.userData,
    rooms
});

export const CanvasNavbar = compose<Props, PassedProps>(
    withRouter,
    connect(mapStateToProps),
    withHandlers(handlers)
)(CanvasNavbarComponent);
