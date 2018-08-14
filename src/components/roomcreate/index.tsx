import React, { Fragment, ComponentType, FormEvent } from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from "react-redux";
import { Dispatch } from 'redux';

import { State, UserData } from "../../store";
import { actions } from "../../actions";

import { RoomCreateForm } from "./form";
import { ImageSelector } from "./imageselector";

interface NewDrawingData {
    name: string;
}

interface Props {
    state: IState
    user: UserData;
    setState: (v: IState) => void;
    handleSubmit: () => void;
    handleDrawingCreate: () => void;
    handleDrawingSelect: () => void;
    setIsPrivate: () => void;
    setName: () => void;
    setPassword: () => void;
    goToNextStage: () => void;
    initCreateNewDrawing: (v: NewDrawingData) => Dispatch;
    initDrawingSelect: (v: number) => Dispatch;
    initRoomCreate: (data: any) => Dispatch;
}

export interface IState {
    name: string;
    password: string | null;
    isPrivate: boolean;
    formStage: number;
}

const handlers = {
    setName: (props: Props) => (e: FormEvent<HTMLInputElement>) => {
        props.setState({ ...props.state, name: e.currentTarget.value });
    },
    setPassword: (props: Props) => (e: FormEvent<HTMLInputElement>) => {
        props.setState({ ...props.state, password: e.currentTarget.value });
    },
    setIsPrivate: (props: Props) => () => {
        const newState = { ...props.state, isPrivate: !props.state.isPrivate };
        if (!newState.isPrivate) newState.password = ''; //reset if input is hidden
        props.setState(newState);
    },
    goToNextStage: (props: Props) => () => {
        props.setState({ ...props.state, formStage: 2 });
    },
    handleDrawingCreate: (props: Props) => () => {
        props.initCreateNewDrawing({ name: props.state.name });
    },
    handleDrawingSelect: (props: Props) => (e: any) => {
        props.initDrawingSelect(e.target.dataset.id);
    },
    handleSubmit: (props: Props) => (e: any) => {
        const { user, state } = props;

        props.initRoomCreate({
            name: state.name,
            adminId: user.id,
            isPrivate: state.isPrivate,
            password: state.password
        });
    }
};

export const RoomCreateComponent: ComponentType<Props> = (props) => {
    const { handleSubmit, state, setName, setPassword, setIsPrivate, goToNextStage,
        handleDrawingCreate, handleDrawingSelect } = props;

    switch (state.formStage) {
        case 1: return (<RoomCreateForm state={state} goToNextStage={goToNextStage} setName={setName}
            setPassword={setPassword} setIsPrivate={setIsPrivate} />);
        case 2: return (<ImageSelector handleDrawingCreate={handleDrawingCreate}
            handleSubmit={handleSubmit} handleDrawingSelect={handleDrawingSelect} />);
    }
};

const mapStateToProps = ({ user }: State) => ({ user: user.userData });

const mapDispatchToProps = (dispatch: Dispatch) => ({
    initRoomCreate: (data: any) => dispatch(actions.rooms.initRoomCreate(data)),
    initCreateNewDrawing: (v: NewDrawingData) => dispatch(actions.user.initCreateNewDrawing(v)),
    initDrawingSelect: (v: number) => dispatch(actions.user.initDrawingSelect(v))
});

export const RoomCreate = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withState('state', 'setState', {
        isPrivate: false,
        name: '',
        password: '',
        formStage: 1
    }),
    withHandlers(handlers)
)(RoomCreateComponent);
