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

export const CanvasComponent = ({
  createBoardRef,
  createBackBoardRef,
  getBoardRef,
  getCtx,
  boardState,
  setSelectedColor,
  handleResetBtn,
  setIsImageSelectorOpen,
  handleImageChange,
  setIsColorPickerOpen,
  setWeight,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  clearCanvas,
  drawCanvas,
}: Props) => (
  <div id="canvas">
    <CanvasNavbar
      setSelectedColor={setSelectedColor}
      handleResetBtn={handleResetBtn}
      setIsImageSelectorOpen={setIsImageSelectorOpen}
      setIsColorPickerOpen={setIsColorPickerOpen}
      isColorPickerOpen={boardState.isColorPickerOpen}
      setWeight={setWeight}
      weight={boardState.weight}
    />
    <ImageSelector
      isOpen={boardState.isImageSelectorOpen}
      handleImageChange={handleImageChange}
    />
    <div style={positionRelativeStyle}>
      <MainCanvas
        createBoardRef={createBoardRef}
        getBoardRef={getBoardRef}
        getCtx={getCtx}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        clearCanvas={clearCanvas}
        drawCanvas={drawCanvas}
      />
      <BackCanvas createBackBoardRef={createBackBoardRef} />
    </div>
  </div>
);

interface PassedMainCanvasProps {
  createBoardRef: Props['createBoardRef'];
  getBoardRef: Props['getBoardRef'];
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
  lifecycle<CombinedMainCanvasProps, {}>({
    componentWillReceiveProps(nextP) {
      const { getCtx, getBoardRef, drawingPoints } = this.props;
      const shouldRedraw = nextP.drawingPoints !== drawingPoints;

      if (shouldRedraw) {
        this.props.clearCanvas(getCtx(), getBoardRef());
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

interface BackCanvasProps {}

interface BackCanvasPassedProps {
  createBackBoardRef: Props['createBackBoardRef'];
}

type CombinedBackCanvasProps = BackCanvasProps & BackCanvasPassedProps;

const BackCanvas = ({ createBackBoardRef }: CombinedBackCanvasProps) => (
  <canvas
    ref={createBackBoardRef}
    width={1280}
    height={720}
    style={{ border: '1px solid #999', width: '100%' }}
  />
);
