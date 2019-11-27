import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { actions } from '../../actions';
const {
  canvas: { initGetImagesFromServer },
} = actions;
import { State, DrawingObject } from '../../store/interfaces';

import { GalleryComponent } from './template';

import { withAuthentication } from '../../HOCs/withAuthentication';

export interface Props {
  drawings: DrawingObject[] | null;
  state: NavState;
  setState: (s: NavState) => void;
  onSlideChanged: (evt: any) => void;
  slideNext: () => void;
  slidePrev: () => void;
  slideTo: (i: number) => void;
  initGetImagesFromServer: () => Dispatch;
  createThumbSliderRef: (ref: any) => void;
}

interface NavState {
  idx: number;
  items: JSX.Element[] | undefined;
  thumbItems: JSX.Element[] | undefined;
}

const handlers = () => {
  let thumbSliderRef: any;

  return {
    createThumbSliderRef: () => (ref: any) => (thumbSliderRef = ref),
    onSlideChanged: ({ state, setState }: Props) => (e: any) => {
      setState({ ...state, idx: e.item });

      const items = Array.from(
        thumbSliderRef.rootComponent.querySelectorAll(
          'ul > li:not(.__cloned) figure',
        )!,
      ) as HTMLElement[];

      items.forEach((itm: any) => itm.classList.remove('img-active'));
      items[e.item].classList.add('img-active');
    },
    slideNext: ({ state, setState, drawings }: Props) => () =>
      setState({
        ...state,
        idx: state.idx === drawings!.length - 1 ? 0 : state.idx + 1,
      }),
    slidePrev: ({ state, setState, drawings }: Props) => () =>
      setState({
        ...state,
        idx: state.idx === 0 ? drawings!.length - 1 : state.idx - 1,
      }),
    slideTo: ({ state, setState }: Props) => (i: number) => {
      setState({ ...state, idx: i });
    },
  };
};

export const Gallery = compose<Props, {}>(
  connect(
    ({ user }: State) => ({
      drawings: user.drawings,
    }),
    { initGetImagesFromServer },
  ),
  withState('state', 'setState', {
    idx: 0,
    items: undefined,
    thumbItems: undefined,
  }),
  withHandlers(handlers),
  withAuthentication,
)(GalleryComponent);

export default Gallery;
