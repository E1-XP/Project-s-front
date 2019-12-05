import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  lifecycle,
  ReactLifeCycleFunctions,
} from 'recompose';
import styled from 'styled-components';

import { State, DrawingPoint } from './../../../store/interfaces';

import { Props } from './../index';

const BackCanvasElem = styled.canvas`
  border: 1px solid #999;
  width: 100%;
`;

interface BackCanvasProps {
  drawingPointsCache: DrawingPoint[][];
}

interface BackCanvasPassedProps {
  createBackBoardRef: Props['createBackBoardRef'];
  getCtx: Props['getBackCtx'];
  redrawBack: Props['redrawBack'];
}

type CombinedBackCanvasProps = BackCanvasProps & BackCanvasPassedProps;

const hooks: ReactLifeCycleFunctions<
  CombinedBackCanvasProps,
  BackCanvasPassedProps
> = {
  UNSAFE_componentWillReceiveProps(nextP) {
    const shouldRedraw =
      nextP.drawingPointsCache !== this.props.drawingPointsCache;

    if (shouldRedraw) {
      this.props.redrawBack();
    }
  },
};

export const BackCanvas = compose<
  CombinedBackCanvasProps,
  BackCanvasPassedProps
>(
  connect(({ canvas }: State) => ({
    drawingPointsCache: canvas.drawingPointsCache,
  })),
  lifecycle(hooks),
)(({ createBackBoardRef }: CombinedBackCanvasProps) => (
  <BackCanvasElem ref={createBackBoardRef} width={1280} height={720} />
));
