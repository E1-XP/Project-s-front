import React from 'react';
import { connect } from 'react-redux';
import { compose, shouldUpdate, lifecycle } from 'recompose';
import styled from 'styled-components';

import {
  State,
  DrawingPoint,
  BroadcastedDrawingPoints,
} from './../../store/interfaces';

import { Props } from './index';

import { CanvasNavbar } from './toolbar';
import { ImageSelector } from './imageselector';

const CanvasWrapper = styled.div`
  position: relative;
`;

const MainCanvasElem = styled.canvas`
  position: absolute;
  border: 1px solid #999;
  width: 100%;
`;

const BackCanvasElem = styled.canvas`
  border: 1px solid #999;
  width: 100%;
`;

export const CanvasComponent = ({
  createBoardRef,
  createBackBoardRef,
  getCtx,
  getBackCtx,
  boardState,
  setSelectedColor,
  handleResetBtn,
  setIsImageSelectorOpen,
  handleImageChange,
  setIsColorPickerOpen,
  handleSetWeight,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  redraw,
  redrawBack,
  weight,
}: Props) => (
  <>
    <CanvasNavbar
      setSelectedColor={setSelectedColor}
      handleResetBtn={handleResetBtn}
      setIsImageSelectorOpen={setIsImageSelectorOpen}
      setIsColorPickerOpen={setIsColorPickerOpen}
      isColorPickerOpen={boardState.isColorPickerOpen}
      setWeight={handleSetWeight}
      weight={weight}
    />
    <ImageSelector
      isOpen={boardState.isImageSelectorOpen}
      handleImageChange={handleImageChange}
    />
    <CanvasWrapper>
      <MainCanvas
        createBoardRef={createBoardRef}
        getCtx={getCtx}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        redraw={redraw}
      />
      <BackCanvas
        createBackBoardRef={createBackBoardRef}
        getCtx={getBackCtx}
        redraw={redrawBack}
      />
    </CanvasWrapper>
  </>
);

interface PassedMainCanvasProps {
  createBoardRef: Props['createBoardRef'];
  getCtx: Props['getCtx'];
  onMouseDown: Props['onMouseDown'];
  onMouseMove: Props['onMouseMove'] | undefined;
  onMouseUp: Props['onMouseUp'];
  redraw: Props['redraw'];
}

interface MainCanvasProps {
  drawingPoints: DrawingPoint[][];
  broadcastedDrawingPoints: BroadcastedDrawingPoints;
}

type CombinedMainCanvasProps = MainCanvasProps & PassedMainCanvasProps;

const MainCanvas = compose<CombinedMainCanvasProps, PassedMainCanvasProps>(
  connect(({ canvas }: State) => ({
    drawingPoints: canvas.drawingPoints,
    broadcastedDrawingPoints: canvas.broadcastedDrawingPoints,
  })),
  lifecycle<CombinedMainCanvasProps, PassedMainCanvasProps>({
    componentDidMount() {
      const { drawingPoints, broadcastedDrawingPoints } = this.props;
      const shouldRedraw =
        drawingPoints.length ||
        Object.values(broadcastedDrawingPoints).some(v => !!v.length);

      if (shouldRedraw) this.props.redraw();
    },
    componentWillReceiveProps(nextP) {
      const { drawingPoints, broadcastedDrawingPoints } = this.props;
      const shouldRedraw =
        nextP.drawingPoints !== drawingPoints ||
        nextP.broadcastedDrawingPoints !== broadcastedDrawingPoints;

      if (shouldRedraw) this.props.redraw();
    },
  }),
)(
  ({
    createBoardRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    drawingPoints,
  }: CombinedMainCanvasProps) => (
    <MainCanvasElem
      ref={createBoardRef}
      width={1280}
      height={720}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  ),
);

interface BackCanvasProps {
  drawingPointsCache: DrawingPoint[][];
}

interface BackCanvasPassedProps {
  createBackBoardRef: Props['createBackBoardRef'];
  getCtx: Props['getBackCtx'];
  redraw: Props['redraw'];
}

type CombinedBackCanvasProps = BackCanvasProps & BackCanvasPassedProps;

const BackCanvas = compose<CombinedBackCanvasProps, BackCanvasPassedProps>(
  connect(({ canvas }: State) => ({
    drawingPointsCache: canvas.drawingPointsCache,
  })),
  lifecycle<CombinedBackCanvasProps, BackCanvasPassedProps>({
    componentWillReceiveProps(nextP) {
      const shouldRedraw =
        nextP.drawingPointsCache !== this.props.drawingPointsCache;

      if (shouldRedraw) {
        console.log('redrawing back');
        this.props.redraw();
      }
    },
  }),
)(({ createBackBoardRef }: CombinedBackCanvasProps) => (
  <BackCanvasElem ref={createBackBoardRef} width={1280} height={720} />
));
