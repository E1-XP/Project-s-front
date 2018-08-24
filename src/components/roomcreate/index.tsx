import { FormEvent } from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from "react-redux";
import { Dispatch } from 'redux';

import { State, UserData } from "../../store";
import { actions } from "../../actions";

import { RoomCreateComponent } from './template';

interface NewDrawingData {
    name: string;
}

export interface Props {
    state: IState
    user: UserData;
    currentDrawing: string;
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
        props.initDrawingSelect(e.target.closest('li').dataset.id);
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

const mapStateToProps = ({ user, canvas }: State) => ({
    user: user.userData,
    currentDrawing: canvas.currentDrawing
});

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
