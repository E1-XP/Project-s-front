import React, { Fragment, ComponentType } from 'react';
import { compose, withHandlers, withState } from 'recompose';

import { IState } from "./index";

interface Props {

}

interface PassedProps {
    state: IState
    setIsPrivate: () => void;
    setName: () => void;
    setPassword: () => void;
    goToNextStage: () => void;
}

export const RoomCreateFormComponent: ComponentType<Props & PassedProps> = (props) => {
    const { state, setName, setPassword, setIsPrivate, goToNextStage } = props;

    return (<div>
        <h2>Create New Room</h2>
        <input placeholder="name" value={state.name} onChange={setName} />
        <br />
        <label htmlFor="isPrivate" >set as private?</label> <input
            type="checkbox" name="isPrivate" checked={state.isPrivate} onChange={setIsPrivate} />
        <br />
        {state.isPrivate && <Fragment>
            <input type="password" placeholder="password" value={state.password} onChange={setPassword} />
            <br />
        </Fragment>}
        <button onClick={goToNextStage}>Next</button>
    </div>);
};

export const RoomCreateForm = compose<Props, PassedProps>(

)(RoomCreateFormComponent);