import React from 'react';
import { connect } from 'react-redux';
import { compose, shouldUpdate, lifecycle } from 'recompose';
import './style.scss';

import { State, DrawingPoint } from './../../store/interfaces';

import { Props } from './index';

import { CanvasNavbar } from './toolbar';
import { ImageSelector } from './imageselector';

const positionRelativeStyle: any = { position: 'relative' };
const mainCanvasStyle: any = {
  position: 'absolute',
  border: '1px solid #999',
  width: '100%',
};
const backCanvasStyle = { border: '1px solid #999', width: '100%' };

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
  clearCanvas,
  drawCanvas,
  weight,
}: Props) => (
  <div id="canvas">
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
    <div style={positionRelativeStyle}>
      <MainCanvas
        createBoardRef={createBoardRef}
        getCtx={getCtx}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        clearCanvas={clearCanvas}
        drawCanvas={drawCanvas}
      />
      <BackCanvas
        createBackBoardRef={createBackBoardRef}
        getCtx={getBackCtx}
        clearCanvas={clearCanvas}
        drawCanvas={drawCanvas}
      />
    </div>
  </div>
);

interface PassedMainCanvasProps {
  createBoardRef: Props['createBoardRef'];
  getCtx: Props['getCtx'];
  onMouseDown: Props['onMouseDown'];
  onMouseMove: Props['onMouseMove'] | undefined;
  onMouseUp: Props['onMouseUp'];
  clearCanvas: Props['clearCanvas'];
  drawCanvas: Props['drawCanvas'];
}

interface MainCanvasProps {
  drawingPoints: DrawingPoint[][];
}

type CombinedMainCanvasProps = MainCanvasProps & PassedMainCanvasProps;

const MainCanvas = compose<CombinedMainCanvasProps, PassedMainCanvasProps>(
  connect(({ canvas }: State) => ({ drawingPoints: canvas.drawingPoints })),
  lifecycle<CombinedMainCanvasProps, PassedMainCanvasProps>({
    componentWillReceiveProps(nextP) {
      const { getCtx, drawingPoints } = this.props;
      const shouldRedraw = nextP.drawingPoints !== drawingPoints;

      if (shouldRedraw) {
        this.props.clearCanvas(getCtx());
        this.props.drawCanvas(getCtx());
      }
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
    <canvas
      ref={createBoardRef}
      width={1280}
      height={720}
      style={mainCanvasStyle}
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
  clearCanvas: Props['clearCanvas'];
  drawCanvas: Props['drawCanvas'];
}

type CombinedBackCanvasProps = BackCanvasProps & BackCanvasPassedProps;

const BackCanvas = compose<CombinedBackCanvasProps, BackCanvasPassedProps>(
  connect(({ canvas }: State) => ({
    drawingPointsCache: canvas.drawingPointsCache,
  })),
  lifecycle<CombinedBackCanvasProps, BackCanvasPassedProps>({
    componentWillReceiveProps(nextP) {
      const { getCtx, drawingPointsCache } = this.props;
      const shouldRedraw = nextP.drawingPointsCache !== drawingPointsCache;

      if (shouldRedraw) {
        console.log('redrawing back');
        this.props.clearCanvas(getCtx());
        this.props.drawCanvas(getCtx(), true);
      }
    },
  }),
)(({ createBackBoardRef }: CombinedBackCanvasProps) => (
  <canvas
    ref={createBackBoardRef}
    width={1280}
    height={720}
    style={backCanvasStyle}
  />
));
