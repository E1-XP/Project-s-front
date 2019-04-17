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

import { State, DrawingPoint } from '../../store/interfaces';

import { withCanvasHandlers } from './../../HOCs/withCanvasHandlers';
import { withRef } from './../../HOCs/withRef';

import { CanvasComponent } from './template';

export interface Props {
  boardState: BoardState;
  setBoardState: (v: object) => void;
  drawingPoints: DrawingPoint[][];
  fill: string;
  weight: number;
  setWeight: (v: number) => Dispatch;
  handleSetWeight: (e: any, val: number) => void;
  setFill: (val: string) => void;
  setIsColorPickerOpen: (val: boolean) => void;
  setIsImageSelectorOpen: (val?: boolean) => void;
  clearDrawingPoints: () => Dispatch;
  initCanvasToImage: (v: any) => Dispatch;
  setSelectedColor: (e: any) => void;
  handleImageChange: (e: any) => void;
  initInRoomDrawingSelect: (id: number) => Dispatch;
  handleReset: () => void;
  createBoardRef: (ref: any) => void;
  createBackBoardRef: (ref: HTMLCanvasElement) => void;
  getBoardRef: () => HTMLCanvasElement;
  getBackBoardRef: () => HTMLCanvasElement;
  getCtx: () => CanvasRenderingContext2D;
  getBackCtx: () => CanvasRenderingContext2D;
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseUp: (e: MouseEvent) => void;
  redraw: () => void;
  redrawBack: () => void;
  onCanvasResize: () => void;
  onMouseUpOutsideBoard: () => void;
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
  componentWillUnmount() {
    window.removeEventListener('resize', this.props.onCanvasResize);
    document.removeEventListener('mouseup', this.props.onMouseUpOutsideBoard);
  },
};

const stateHandlers = {
  setIsImageSelectorOpen: (props: Props) => (isOpened?: boolean) => {
    const value = isOpened || !props.boardState.isImageSelectorOpen;
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

const handlers1 = {
  handleImageChange: (props: Props) => (e: any) => {
    props.initInRoomDrawingSelect(Number(e.target.closest('li').dataset.id));
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
    ({ canvas }: State) => ({ fill: canvas.fill, weight: canvas.weight }),
    mapDispatchToProps,
  ),
  withState('boardState', 'setBoardState', {
    isImageSelectorOpen: false,
    isColorPickerOpen: false,
  }),
  withHandlers(stateHandlers),
  withHandlers(handlers1),
  withCanvasHandlers,
  lifecycle(hooks),
  pure,
  withRef('createBoardRef', 'createBackBoardRef'),
)(CanvasComponent);
