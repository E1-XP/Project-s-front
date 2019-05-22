import React from 'react';
import styled from 'styled-components';

import { Props } from './index';

import { CanvasNavbar } from './toolbar';
import { ImageSelector } from './imageselector';
import { MainCanvas } from './canvases/main';
import { BackCanvas } from './canvases/back';

const CanvasWrapper = styled.div`
  position: relative;
`;

export const CanvasComponent = ({
  createBoardRef,
  createBackBoardRef,
  getCtx,
  getBackCtx,
  boardState,
  setSelectedColor,
  handleReset,
  setIsImageSelectorOpen,
  handleImageChange,
  setIsColorPickerOpen,
  handleSetWeight,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  redraw,
  redrawBack,
  weight,
}: Props) => (
  <>
    <CanvasNavbar
      setSelectedColor={setSelectedColor}
      handleResetBtn={handleReset}
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        redraw={redraw}
      />
      <BackCanvas
        createBackBoardRef={createBackBoardRef}
        getCtx={getBackCtx}
        redrawBack={redrawBack}
      />
    </CanvasWrapper>
  </>
);
