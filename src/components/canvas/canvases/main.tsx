import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  shouldUpdate,
  lifecycle,
  ReactLifeCycleFunctions,
} from 'recompose';
import styled from 'styled-components';

import {
  State,
  DrawingPoint,
  BroadcastedDrawingPoints,
} from './../../../store/interfaces';

import { Props } from './../index';

const MainCanvasElem = styled.canvas`
  position: absolute;
  border: 1px solid #999;
  width: 100%;
  touch-action: none;
`;

interface PassedMainCanvasProps {
  createBoardRef: Props['createBoardRef'];
  getCtx: Props['getCtx'];
  onPointerDown: Props['onPointerDown'];
  onPointerMove: Props['onPointerMove'] | undefined;
  onPointerUp: Props['onPointerUp'];
  redraw: Props['redraw'];
}

interface MainCanvasProps {
  drawingPoints: DrawingPoint[][];
  broadcastedDrawingPoints: BroadcastedDrawingPoints;
}

type CombinedMainCanvasProps = MainCanvasProps & PassedMainCanvasProps;

const hooks: ReactLifeCycleFunctions<
  CombinedMainCanvasProps,
  PassedMainCanvasProps
> = {
  componentDidMount() {
    const { drawingPoints, broadcastedDrawingPoints } = this.props;
    const shouldRedraw =
      drawingPoints.length ||
      Object.values(broadcastedDrawingPoints).some(v => !!v.length);

    if (shouldRedraw) {
      this.props.redraw();
    }
  },
  componentWillReceiveProps(nextP) {
    const { drawingPoints, broadcastedDrawingPoints } = this.props;
    const shouldRedraw =
      nextP.drawingPoints !== drawingPoints ||
      nextP.broadcastedDrawingPoints !== broadcastedDrawingPoints;

    if (shouldRedraw) {
      this.props.redraw();
    }
  },
};

export const MainCanvas = compose<
  CombinedMainCanvasProps,
  PassedMainCanvasProps
>(
  connect(({ canvas }: State) => ({
    drawingPoints: canvas.drawingPoints,
    broadcastedDrawingPoints: canvas.broadcastedDrawingPoints,
  })),
  lifecycle(hooks),
)(
  ({
    createBoardRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    drawingPoints,
  }: CombinedMainCanvasProps) => (
    <MainCanvasElem
      ref={createBoardRef}
      width={1280}
      height={720}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
      onMouseMove={onPointerMove}
      onTouchMove={onPointerMove}
      onMouseUp={onPointerUp}
      onTouchEnd={onPointerUp}
    />
  ),
);
