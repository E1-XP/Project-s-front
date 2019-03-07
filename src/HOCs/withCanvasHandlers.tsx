import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MouseEvent } from 'react';

import { actions } from './../actions';
const {
  canvas: { setIsMouseDown, setGroupCount, createDrawingPoint },
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
    },
    onMouseUpOutsideBoard: (props: Props) => () => {},
    // redraw: (props: Props) => () => {},
    // redrawBack: (props: Props) => () => {},
  };
};

export const withCanvasHandlers = compose(
  connect(
    ({ canvas }: State) => ({
      groupCount: canvas.groupCount,
      isMouseDown: canvas.isMouseDown,
    }),
    { setIsMouseDown, setGroupCount, createDrawingPoint },
  ),
  withHandlers(handlers()),
);
