import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  shouldUpdate,
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

const backHooks: ReactLifeCycleFunctions<
  CombinedBackCanvasProps,
  BackCanvasPassedProps
> = {
  componentDidUpdate(prevP) {
    const shouldRedraw =
      prevP.drawingPointsCache !== this.props.drawingPointsCache;

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
  lifecycle(backHooks),
)(({ createBackBoardRef }: CombinedBackCanvasProps) => (
  <BackCanvasElem ref={createBackBoardRef} width={1280} height={720} />
));
