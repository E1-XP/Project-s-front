import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MouseEvent } from 'react';
import throttle from 'lodash/throttle';

import { actions } from './../actions';
const {
  canvas: {
    setIsMouseDown,
    setGroupCount,
    createDrawingPoint,
    initCanvasToImage,
  },
} = actions;

import { State } from './../store/interfaces';

interface Props {
  groupCount: number;
  isMouseDown: boolean;
  setIsMouseDown: (v: boolean) => Dispatch;
  setGroupCount: (v: number) => Dispatch;
  createDrawingPoint: (
    e: object,
    ref: HTMLCanvasElement,
    onMouseDown?: boolean,
  ) => Dispatch;
  initCanvasToImage: (v: any) => Dispatch;
  drawCanvas: (
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
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseUp: (e: MouseEvent) => void;
  onMouseUpOutsideBoard: () => void;
  onCanvasResize: () => void;
  redraw: () => void;
  redrawBack: () => void;
}

const handlers = () => {
  let boardRef: HTMLCanvasElement;
  let backBoardRef: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let backCtx: CanvasRenderingContext2D;

  return {
    createBoardRef: (props: Props) => (ref: HTMLCanvasElement) =>
      (boardRef = ref),
    createBackBoardRef: (props: Props) => (ref: HTMLCanvasElement) =>
      (backBoardRef = ref),
    getBoardRef: (props: Props) => () => boardRef,
    getBackBoardRef: (props: Props) => () => backBoardRef,
    getCtx: (props: Props) => () => {
      if (!ctx) ctx = boardRef.getContext('2d')!;
      return ctx;
    },
    getBackCtx: (props: Props) => () => {
      if (!backCtx) backCtx = backBoardRef.getContext('2d')!;
      return backCtx;
    },
    onMouseDown: (props: Props) => (e: MouseEvent) => {
      const { pageX, pageY } = e;
      console.log('mouse down');
      props.setIsMouseDown(true);
      props.createDrawingPoint({ pageX, pageY }, boardRef!, true);
    },
    onMouseMove: (props: Props) => (e: MouseEvent) => {
      if (!props.isMouseDown) return;

      const { pageX, pageY } = e;
      props.createDrawingPoint({ pageX, pageY }, boardRef!);
    },
    onMouseUp: (props: Props) => (e: MouseEvent) => {
      const { groupCount } = props;

      props.setIsMouseDown(false);
      props.setGroupCount(groupCount + 1);

      setTimeout(() => {
        const imgB64 = boardRef.toDataURL('image/jpeg', 0.5);
        props.initCanvasToImage(imgB64); // TODO merge both layers
      }, 500);
    },
    onMouseUpOutsideBoard: (props: Props) => () => {},
  };
};

const handlers2 = {
  redraw: (props: Props) => () => {
    props.clearCanvas(props.getCtx());
    props.drawCanvas(props.getCtx());
  },
  redrawBack: (props: Props) => () => {
    props.clearCanvas(props.getBackCtx());
    props.drawCanvas(props.getBackCtx(), true);
  },
  onCanvasResize: (props: Props) =>
    throttle(() => {
      props.clearCanvas(props.getCtx());
      props.drawCanvas(props.getCtx());
    }, 1000 / 60),
};

export const withCanvasHandlers = compose(
  connect(
    ({ canvas }: State) => ({
      groupCount: canvas.groupCount,
      isMouseDown: canvas.isMouseDown,
    }),
    { setIsMouseDown, setGroupCount, createDrawingPoint, initCanvasToImage },
  ),
  withHandlers(handlers()),
  withHandlers(handlers2),
);
