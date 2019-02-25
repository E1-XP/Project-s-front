import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import './style.scss';

import { State } from '../../store/interfaces';

import { Props } from './index';

import { CanvasNavbar } from './toolbar';
import { ImageSelector } from './imageselector';

export const CanvasComponent = ({
  createBoardRef,
  createBackBoardRef,
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
  isMouseDown,
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
    <div style={{ position: 'relative' }}>
      <MainCanvas
        createBoardRef={createBoardRef}
        onMouseDown={onMouseDown}
        onMouseMove={isMouseDown ? onMouseMove : undefined}
        onMouseUp={onMouseUp}
      />
      <BackCanvas createBackBoardRef={createBackBoardRef} />
    </div>
  </div>
);

interface PassedMainCanvasProps {
  createBoardRef: Props['createBoardRef'];
  onMouseDown: Props['onMouseDown'];
  onMouseMove: Props['onMouseMove'] | undefined;
  onMouseUp: Props['onMouseUp'];
}

interface MainCanvasProps {}

type CombinedMainCanvasProps = MainCanvasProps & PassedMainCanvasProps;

const MainCanvas = compose<CombinedMainCanvasProps, PassedMainCanvasProps>(
  connect(() => ({})),
  lifecycle({
    componentDidUpdate(prevP) {},
  }),
)(
  ({
    createBoardRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  }: CombinedMainCanvasProps) => (
    <canvas
      ref={createBoardRef}
      width={1280}
      height={720}
      style={{ position: 'absolute', border: '1px solid #999', width: '100%' }}
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

const BackCanvas = compose<CombinedBackCanvasProps, BackCanvasPassedProps>(
  connect(({  }: State) => ({})),
  lifecycle({
    componentDidUpdate(prevP) {},
  }),
)(({ createBackBoardRef }) => (
  <canvas
    ref={createBackBoardRef}
    width={1280}
    height={720}
    style={{ border: '1px solid #999', width: '100%' }}
  />
));
