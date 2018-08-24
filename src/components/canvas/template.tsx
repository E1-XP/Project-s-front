import React, { ComponentType } from "react";
import _throttle from "lodash.throttle";
import './style.scss';

import { Props } from './index';

import { CanvasNavbar } from "./navbar";
import { ImageSelector } from "./imageselector";

export const CanvasComponent: ComponentType<Props> = ({ onRef, boardState, setSelectedColor,
    handleMouseDown, handleMouseUp, handleResetBtn, handleMouseMove, setIsImageSelectorOpen,
    handleImageChange }) => {

    return (<div id="canvas">
        <CanvasNavbar setSelectedColor={setSelectedColor} handleResetBtn={handleResetBtn}
            setIsImageSelectorOpen={setIsImageSelectorOpen}
            isColorPickerOpen={boardState.isColorPickerOpen}
        />
        <ImageSelector isOpen={boardState.isImageSelectorOpen} handleImageChange={handleImageChange} />
        <canvas id="board"
            ref={onRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
            onMouseMove={boardState.isMouseDown ? _throttle(handleMouseMove, 50) : null}
            width={window.innerWidth * 0.6} height={window.innerHeight * 0.9}
        />
    </div>);
};
