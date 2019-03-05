import { MouseEvent } from 'react';
import {
  compose,
  lifecycle,
  withHandlers,
  withState,
  ReactLifeCycleFunctions,
  onlyUpdateForKeys,
  pure,
} from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import throttle from 'lodash/throttle';

import { actions } from '../../actions';
const {
  canvas: { initCanvasToImage, drawCanvas, clearCanvas },
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
  setWeight: (e: any, val: number) => void;
  setIsColorPickerOpen: (val: boolean) => void;
  setIsImageSelectorOpen: (val?: boolean) => void;
  initClearDrawingPoints: () => Dispatch;
  initCanvasToImage: (v: any) => Dispatch;
  setSelectedColor: (e: any) => void;
  handleImageChange: (e: any) => void;
  initInRoomDrawingSelect: (id: number) => Dispatch;
  handleResetBtn: () => void;
  createBoardRef: (ref: any) => void;
  createBackBoardRef: (ref: HTMLCanvasElement) => void;
  getBoardRef: () => HTMLCanvasElement;
  getBackBoardRef: () => HTMLCanvasElement;
  getCtx: () => CanvasRenderingContext2D;
  getBackCtx: () => CanvasRenderingContext2D;
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseUp: (e: MouseEvent) => void;
  drawCanvas: (ctx: CanvasRenderingContext2D) => Dispatch;
  clearCanvas: (
    ctx: CanvasRenderingContext2D,
    ref: HTMLCanvasElement,
  ) => Dispatch;
}

interface BoardState {
  isImageSelectorOpen: boolean;
  isColorPickerOpen: boolean;
  selectedColor: string;
  weight: number;
}

const stateHandlers = {
  setIsImageSelectorOpen: (props: Props) => (isOpened?: boolean) => {
    const value = isOpened || !props.boardState.isImageSelectorOpen;
    const bothOpened = value && props.boardState.isColorPickerOpen;

    const newState = { ...props.boardState, isImageSelectorOpen: value };
    if (bothOpened) newState.isColorPickerOpen = false;

    props.setBoardState(newState);
  },
  setSelectedColor: (props: Props) => (color: any) => {
    props.setBoardState({ ...props.boardState, selectedColor: color.hex });
  },
  setWeight: (props: Props) => (e: any, value: number) => {
    props.setBoardState({ ...props.boardState, weight: value });
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
    props.initInRoomDrawingSelect(e.target.closest('li').dataset.id);
  },
  handleResetBtn: (props: Props) => (e: HTMLButtonElement) => {
    // ctx.clearRect(0, 0, boardRef.width, boardRef.height);
    // ctx.fillStyle = '#ffffff';
    // ctx.fillRect(0, 0, boardRef.width, boardRef.height);
    // props.initClearDrawingPoints();
    // setTimeout(() => {
    //   const imgB64 = boardRef.toDataURL('image/jpeg', 0.5);
    //   props.initCanvasToImage(imgB64);
    // }, 500);
  },
};

const handlers2 = {
  //   prepareForUnmount: (props: Props) => () => {
  //     document.removeEventListener('mouseup', props.setIsMouseDownFalse);
  //     window.removeEventListener('resize', props.renderImage);
  //   },
  //   handleResize: (props: Props) => () => {
  //     window.addEventListener('resize', props.renderImage);
  //   },
  //   handleMouseDown: (props: Props) => (e: MouseEvent) => {
  //     const { pageX, pageY } = e;
  //     const board = props.getBoardRef();
  //     const { top, left, width, height } = board.getBoundingClientRect();
  //     props.setNewDrawingPointsGroup();
  //     const xPos = ((pageX - left - scrollX) / width) * board.width;
  //     const yPos = ((pageY - top - scrollY) / height) * board.height;
  //     props.drawPoint(e);
  //     props.drawPoint(e, xPos + 2, yPos + 2);
  //     props.renderImage();
  //     props.setIsMouseDown(true);
  //   },
  //   handleMouseUp: (props: Props) => () => {
  //     props.setIsMouseDown(false);
  //     props.initMouseUpBroadcast();
  //     setTimeout(() => {
  //       const imgB64 = props.getBoardRef().toDataURL('image/jpeg', 0.5);
  //       props.initCanvasToImage(imgB64);
  //     }, 500);
  //   },
  //   handleMouseMove: (props: Props) =>
  //     throttle((e: MouseEvent) => {
  //       props.drawPoint(e);
  //       props.renderImage();
  //     }, 150),
};

const mapDispatchToProps = {
  // initClearDrawingPoints: () => null,
  // dispatch(actions.canvas.initClearDrawingPoints()),
  drawCanvas,
  clearCanvas,
  initCanvasToImage,
  initInRoomDrawingSelect,
};

export const Canvas = compose<Props, {}>(
  connect(
    null,
    mapDispatchToProps,
  ),
  withState('boardState', 'setBoardState', {
    isImageSelectorOpen: false,
    isColorPickerOpen: false,
    selectedColor: '#000000',
    weight: 2,
  }),
  withHandlers(stateHandlers),
  withHandlers(handlers1),
  withHandlers(handlers2),
  withCanvasHandlers,
  pure,
  withRef('createBoardRef', 'createBackBoardRef'),
)(CanvasComponent);
