import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { actions } from './../actions';
import { State } from './../store/interfaces';

const handlers = () => {
  let boardRef: HTMLCanvasElement | null = null;
  let backBoardRef: HTMLCanvasElement | null = null;
  // let ctx: CanvasRenderingContext2D;
  // let backCtx: CanvasRenderingContext2D;

  return {
    createBoardRef: () => (ref: HTMLCanvasElement) => (boardRef = ref),
    createBackBoardRef: () => (ref: HTMLCanvasElement) => (backBoardRef = ref),
    onMouseDown: () => () => {
      console.log(boardRef);
    },
    onMouseMove: () => () => {
      console.log('moving');
    },
    onMouseUp: () => () => {
      console.log('up');
    },
  };
};

export const withCanvasHandlers = compose(
  connect(
    null,
    {},
  ),
  withHandlers(handlers()),
);
