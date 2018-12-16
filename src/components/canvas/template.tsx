import React, { ComponentType } from "react";
import "./style.scss";

import { Props } from "./index";

import { CanvasNavbar } from "./navbar";
import { ImageSelector } from "./imageselector";

export const CanvasComponent: ComponentType<Props> = ({
  onRef,
  boardState,
  setSelectedColor,
  handleMouseDown,
  handleMouseUp,
  handleResetBtn,
  handleMouseMove,
  setIsImageSelectorOpen,
  handleImageChange,
  setIsColorPickerOpen,
  setWeight
}) => {
  return (
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
      <canvas
        id="board"
        ref={onRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={boardState.isMouseDown ? handleMouseMove : null}
        width={1280}
        height={720}
      />
    </div>
  );
};
