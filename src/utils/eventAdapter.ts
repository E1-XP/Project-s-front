import { MouseEvent, TouchEvent } from 'react';

type PointerEvent =
  | MouseEvent<HTMLCanvasElement>
  | TouchEvent<HTMLCanvasElement>;

interface ShallowMouseEvent {
  pageX: number;
  pageY: number;
  preventDefault?: TouchEvent['preventDefault'];
}

const isTouchEvt = (e: PointerEvent): e is TouchEvent<HTMLCanvasElement> =>
  ['touchstart', 'touchmove', 'touchend'].includes(e.type);

const isMouseEvt = (e: PointerEvent): e is MouseEvent<HTMLCanvasElement> =>
  ['mousedown', 'mousemove', 'mouseup'].includes(e.type);

type Handler = (e: ShallowMouseEvent) => any;

export const shallowEventAdapter = (handler: Handler) => {
  return (e: PointerEvent) => {
    if (isMouseEvt(e)) {
      const { pageX, pageY } = e;
      const evt = { pageX, pageY };

      return handler(evt);
    }
    if (isTouchEvt(e)) {
      const { pageX, pageY } = e.touches[0];
      const evt = { pageX, pageY, preventDefault: e.preventDefault };

      return handler(evt);
    }
    throw new Error('this type of event is not yet implemented!');
  };
};
