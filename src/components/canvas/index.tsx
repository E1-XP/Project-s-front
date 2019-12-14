import { MouseEvent } from 'react';
import {
  compose,
  withHandlers,
  withState,
  onlyUpdateForKeys,
  pure,
  lifecycle,
  ReactLifeCycleFunctions,
} from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { actions } from '../../actions';
const {
  canvas: { initCanvasToImage, setFill, setWeight },
  rooms: { initInRoomDrawingSelect },
} = actions;

import {
  State,
  DrawingPoint,
  RoomsList,
  Rooms,
  UserData,
  BroadcastedDrawingPoints,
} from '../../store/interfaces';

import {
  withCanvasHandlers,
  Props as CanvasHandlersProps,
} from './../../HOCs/withCanvasHandlers';
import { withRef } from './../../HOCs/withRef';

import { CanvasComponent } from './template';

export interface Props extends CanvasHandlersProps {
  boardState: BoardState;
  setBoardState: (v: object) => void;
  rooms: RoomsList;
  activeRoom: Rooms['active'];
  user: UserData;
  drawingPoints: DrawingPoint[][];
  broadcastedDrawingPoints: BroadcastedDrawingPoints;
  fill: string;
  weight: number;
  setWeight: (v: number) => Dispatch;
  handleSetWeight: (e: any, val: number) => void;
  setFill: (val: string) => void;
  setIsColorPickerOpen: (val: boolean) => void;
  setIsImageSelectorOpen: (val?: boolean) => void;
  clearDrawingPoints: () => Dispatch;
  setSelectedColor: (e: any) => void;
  handleImageChange: (e: any) => void;
  initInRoomDrawingSelect: (id: number) => Dispatch;
  handleReset: () => void;
}

interface BoardState {
  isImageSelectorOpen: boolean;
  isColorPickerOpen: boolean;
}

const hooks: ReactLifeCycleFunctions<Props, {}> = {
  componentDidMount() {
    window.addEventListener('resize', this.props.onCanvasResize);
    document.addEventListener('mouseup', this.props.onMouseUpOutsideBoard);
  },
  componentDidUpdate(prevP) {
    const { activeRoom, rooms, user, initCanvasToImage } = this.props;

    const adminChangedByMe =
      prevP.activeRoom &&
      activeRoom &&
      prevP.rooms[prevP.activeRoom].adminId !== rooms[activeRoom].adminId &&
      +prevP.rooms[prevP.activeRoom].adminId === user.id;

    if (adminChangedByMe && prevP.boardState.isImageSelectorOpen) {
      this.props.setIsImageSelectorOpen(false);
    }

    const otherUserSendDrawEvt =
      prevP.broadcastedDrawingPoints !== this.props.broadcastedDrawingPoints;
    const shouldGenerateThumb = !this.props.isMouseDown && otherUserSendDrawEvt;

    if (shouldGenerateThumb) {
      const ref = this.props.getBoardRef();
      const backRef = this.props.getBackBoardRef();

      requestAnimationFrame(
        () => ref && backRef && initCanvasToImage(ref, backRef, false),
      );
    }
  },
  componentWillUnmount() {
    window.removeEventListener('resize', this.props.onCanvasResize);
    document.removeEventListener('mouseup', this.props.onMouseUpOutsideBoard);
  },
};

const stateHandlers = {
  setIsImageSelectorOpen: (props: Props) => (is?: boolean) => {
    const value = is || !props.boardState.isImageSelectorOpen;
    const bothOpened = value && props.boardState.isColorPickerOpen;

    const newState = { ...props.boardState, isImageSelectorOpen: value };
    if (bothOpened) newState.isColorPickerOpen = false;

    props.setBoardState(newState);
  },
  setIsColorPickerOpen: (props: Props) => (is: boolean) => {
    const bothOpened = is && props.boardState.isImageSelectorOpen;

    const newState = { ...props.boardState, isColorPickerOpen: is };
    if (bothOpened) newState.isImageSelectorOpen = false;

    props.setBoardState(newState);
  },
};

const handlers = {
  handleImageChange: (props: Props) => (e: any) => {
    props.initInRoomDrawingSelect(Number(e.currentTarget.dataset.id));
  },
  setSelectedColor: (props: Props) => (color: any) => {
    props.setFill(color.hex);
  },
  handleSetWeight: (props: Props) => (e: any, value: number) => {
    props.setWeight(value);
  },
};

const mapDispatchToProps = {
  initCanvasToImage,
  initInRoomDrawingSelect,
  setFill,
  setWeight,
};

export const Canvas = compose<Props, {}>(
  connect(
    ({ canvas, rooms, user }: State) => ({
      broadcastedDrawingPoints: canvas.broadcastedDrawingPoints,
      fill: canvas.fill,
      weight: canvas.weight,
      rooms: rooms.list,
      activeRoom: rooms.active,
      user: user.userData,
    }),
    mapDispatchToProps,
  ),
  withState('boardState', 'setBoardState', {
    isImageSelectorOpen: false,
    isColorPickerOpen: false,
  }),
  withHandlers(stateHandlers),
  withHandlers(handlers),
  withCanvasHandlers,
  lifecycle(hooks),
  pure,
  withRef('createBoardRef', 'createBackBoardRef'),
)(CanvasComponent);
