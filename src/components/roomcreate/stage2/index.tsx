import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from "react-redux";
import { Dispatch } from 'redux';

import { State } from "./../../../store";
import { actions } from "../../../actions";

import { ImageSelectorComponent } from "./template";

export interface Props {
    drawings: string[];
    initGetImagesFromTheServer: () => Dispatch;
}

export interface PassedProps {
    handleSubmit: () => void;
    handleDrawingCreate: () => void;
    handleDrawingSelect: (e: any) => void;
    currentDrawing: string | null;
}

const hooks = {
    componentDidMount() {
        this.props.initGetImagesFromTheServer();
    }
};

const mapStateToProps = ({ user }: State) => ({
    drawings: user.drawings
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    initGetImagesFromTheServer: () => dispatch(actions.canvas.initGetImagesFromServer())
});

export const ImageSelector = compose<Props, PassedProps>(
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle<Props, {}>(hooks)
)(ImageSelectorComponent);
