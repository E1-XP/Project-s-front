import React, { Fragment, ComponentType, FormEvent } from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from "react-redux";
import { Dispatch } from 'redux';

import { State } from "./../../store";

import { actions } from "../../actions";

interface Props {
    drawings: string[];
    initGetImagesFromTheServer: () => Dispatch;
}

interface PassedProps {
    handleSubmit: () => void;
    handleDrawingCreate: () => void;
    handleDrawingSelect: (e: any) => void;
}

const hooks = {
    componentDidMount() {
        this.props.initGetImagesFromTheServer();
    }
};

export const ImageSelectorComponent: ComponentType<Props & PassedProps> = (props) => {
    const { handleSubmit, handleDrawingCreate, handleDrawingSelect, drawings } = props;

    return (<div>
        <h2>Select existing image or create new one</h2>
        <ul>
            {drawings ?
                (drawings.length ? drawings.map((itm: any) =>
                    <li key={itm.id} data-id={itm.id}
                        onClick={handleDrawingSelect}>{itm.id}</li>) :
                    'no images found')
                : 'loading...'}
            <button onClick={handleDrawingCreate}>select new drawing</button>
        </ul>
        <button onClick={handleSubmit}>Create room</button>
    </div>)
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
