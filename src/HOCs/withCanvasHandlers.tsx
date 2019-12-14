import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MouseEvent, TouchEvent } from 'react';
import throttle from 'lodash/throttle';

import { shallowEventAdapter } from './../utils/eventAdapter';

import { actions } from './../actions';
const {
  canvas: {
    setIsMouseDown,
    setGroupCount,
    createDrawingPoint,
    initCanvasToImage,
    initDrawCanvas,
    clearCanvas,
    resetDrawing,
    redrawCanvas,
    redrawBackCanvas,
  },
} = actions;

import { State } from './../store/interfaces';

type PointerEvent =
  | MouseEvent<HTMLCanvasElement>
  | TouchEvent<HTMLCanvasElement>;

export interface Props {
  groupCount: number;
  isMouseDown: boolean;
  setIsMouseDown: (v: boolean) => Dispatch;
  setGroupCount: (v: number) => Dispatch;
  createDrawingPoint: (e: object, ref: HTMLCanvasElement) => Dispatch;
  initCanvasToImage: (
    ref: HTMLCanvasElement,
    backRef: HTMLCanvasElement,
    shouldSentImgToServer?: boolean,
  ) => Dispatch;
  initDrawCanvas: (
    ctx: CanvasRenderingContext2D,
    isDrawingOnBack?: boolean,
  ) => Dispatch;
  clearCanvas: (ctx: CanvasRenderingContext2D) => Dispatch;
  createBoardRef: (ref: HTMLCanvasElement) => void;
  createBackBoardRef: (ref: HTMLCanvasElement) => void;
  getBoardRef: () => HTMLCanvasElement;
  getBackBoardRef: () => HTMLCanvasElement;
  getCtx: () => CanvasRenderingContext2D;
  getBackCtx: () => CanvasRenderingContext2D;
  onPointerDown: (e: PointerEvent) => void;
  onPointerMove: (e: PointerEvent) => void;
  onPointerUp: (e: PointerEvent) => void;
  onMouseUpOutsideBoard: () => void;
  onCanvasResize: () => void;
  redraw: () => void;
  redrawCanvas: (ctx: CanvasRenderingContext2D) => Dispatch;
  redrawBackCanvas: (ctx: CanvasRenderingContext2D) => Dispatch;
  redrawBack: () => void;
  handleReset: () => void;
  resetDrawing: () => Dispatch;
}

const handlers = () => {
  let boardRef: HTMLCanvasElement;
  let backBoardRef: HTMLCanvasElement;

  return {
    createBoardRef: (props: Props) => (ref: HTMLCanvasElement) =>
      (boardRef = ref),
    createBackBoardRef: (props: Props) => (ref: HTMLCanvasElement) =>
      (backBoardRef = ref),
    getBoardRef: (props: Props) => () => boardRef,
    getBackBoardRef: (props: Props) => () => backBoardRef,
    getCtx: (props: Props) => () => boardRef.getContext('2d')!,
    getBackCtx: (props: Props) => () => backBoardRef.getContext('2d')!,
    onPointerDown: (props: Props) =>
      shallowEventAdapter(e => {
        e.preventDefault && e.preventDefault();

        props.setIsMouseDown(true);
        props.createDrawingPoint(e, boardRef!);
      }),
    onPointerMove: (props: Props) =>
      shallowEventAdapter(e => {
        e.preventDefault && e.preventDefault();

        if (!props.isMouseDown) return;

        props.createDrawingPoint(e, boardRef!);
      }),
    onPointerUp: (props: Props) => (e: PointerEvent) => {
      const { groupCount } = props;

      props.setIsMouseDown(false);
      props.setGroupCount(groupCount + 1);

      props.initCanvasToImage(boardRef, backBoardRef);
    },
    onMouseUpOutsideBoard: ({
      isMouseDown,
      groupCount,
      setIsMouseDown,
      setGroupCount,
    }: Props) => () => {
      if (isMouseDown) {
        setIsMouseDown(false);
        setGroupCount(groupCount + 1);
      }
    },
  };
};

const handlers2 = {
  redraw: (props: Props) => () => props.redrawCanvas(props.getCtx()),
  redrawBack: (props: Props) => () =>
    props.redrawBackCanvas(props.getBackCtx()),
  handleReset: (props: Props) => () => {
    props.clearCanvas(props.getCtx());
    props.resetDrawing();

    props.initCanvasToImage(props.getBoardRef(), props.getBackBoardRef());
  },
  onCanvasResize: throttle(
    (props: Props) => () => {
      props.clearCanvas(props.getCtx());
      props.initDrawCanvas(props.getCtx());
    },
    1000 / 60,
  ),
};

export const withCanvasHandlers = compose(
  connect(
    ({ canvas }: State) => ({
      groupCount: canvas.groupCount,
      isMouseDown: canvas.isMouseDown,
    }),
    {
      setIsMouseDown,
      setGroupCount,
      createDrawingPoint,
      initCanvasToImage,
      initDrawCanvas,
      clearCanvas,
      resetDrawing,
      redrawCanvas,
      redrawBackCanvas,
    },
  ),
  withHandlers(handlers()),
  withHandlers(handlers2),
);
