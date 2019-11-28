import {
  compose,
  withState,
  withHandlers,
  lifecycle,
  ReactLifeCycleFunctions,
} from 'recompose';
import { connect } from 'react-redux';
import { withTheme, WithTheme } from '@material-ui/core/styles';

import { State, DrawingObject } from '../../../store/interfaces';

import { ImageSelectorComponent, getItems } from './template';

import config from './../../../config';

interface Props extends HandlersProps, WithTheme {
  drawings: DrawingObject[];
  currentDrawing: number | null;
  state: CState;
  setState: (v: CState) => void;
  isMouseDown: boolean;
}

interface HandlersProps {
  createSliderRef: (ref: any) => void;
  onSlideChange: () => void;
  replaceImage: () => void;
  calcCurrThumb: (idx?: number) => number;
  onPrev: () => void;
  onNext: () => void;
  slideTo: (idx: number) => void;
}

interface PassedProps {
  isOpen: boolean;
  handleImageChange: (e: any) => void;
}

interface CState {
  idx: number;
  items: JSX.Element[] | undefined;
}

export type CombinedProps = Props & PassedProps;

const hooks: ReactLifeCycleFunctions<CombinedProps, {}, {}> = {
  componentDidMount() {
    const { state, setState, drawings, handleImageChange } = this.props;

    const items = getItems({
      drawings,
      state,
      handleImageChange,
    });

    setState({ ...state, items });

    requestAnimationFrame(() => {
      const { currentDrawing, state, calcCurrThumb } = this.props;
      const idx = state.items!.findIndex(itm => +itm.key! === currentDrawing!);

      this.props.onSlideChange();
      this.props.slideTo(calcCurrThumb(idx));
    });
  },
  UNSAFE_componentWillReceiveProps(nextP) {
    const { drawings, isMouseDown } = this.props;

    if (drawings !== nextP.drawings && !isMouseDown) {
      requestAnimationFrame(this.props.replaceImage);
    }
  },
  componentDidUpdate(prevP) {
    const { state, setState, currentDrawing } = this.props;

    if (!state.items || prevP.currentDrawing === currentDrawing) return;

    const idx = state.items.findIndex(itm => +itm.key! === currentDrawing!);

    setState({ ...state, idx });
    this.props.onSlideChange();
  },
};

const handlers = () => {
  let sliderRef: any;

  return {
    createSliderRef: () => (ref: any) => (sliderRef = ref),
    onSlideChange: ({ currentDrawing }: Props) => () => {
      if (!sliderRef) return;

      const items = Array.from(
        sliderRef.rootComponent.querySelectorAll(
          'ul > li:not(.__cloned) > button',
        )!,
      ) as HTMLElement[];

      items.forEach(itm => itm.classList.remove('img-active'));

      const isActive = (itm: HTMLElement) =>
        +itm.dataset!.id! === currentDrawing!;

      const activeItm = items!.find(isActive);

      activeItm && activeItm.classList.add('img-active');
    },
    replaceImage: ({ drawings }: Props) => () => {
      if (!sliderRef) return;

      const items = sliderRef.rootComponent.querySelectorAll(
        'ul > li:not(.__cloned) img',
      );
      if (!items) return;

      const getUrl = (itm: DrawingObject) =>
        `${config.API_URL}/static/images/${itm.id}-v${itm.version}.jpg`;

      const loadAndReplace = (elm: HTMLImageElement, data: DrawingObject) => {
        const img = new Image();

        const onLoad = () => (elm.src = img.src);
        img.addEventListener('load', onLoad, {
          once: true,
        });

        img.src = getUrl(data);

        elm.dataset.v = `${data.version}`;
      };
      const findAndReplace = (itm: DrawingObject, i: number) => {
        const shouldUpdate = items[i] && itm.version !== +items[i].dataset.v;
        if (shouldUpdate) loadAndReplace(items[i], itm);
      };

      drawings.forEach(findAndReplace);
    },
    calcCurrThumb: ({ drawings, state }: Props) => (idx = state.idx) => {
      const stageLen = window.innerWidth >= 445 ? 3 : 2;

      if (drawings!.length <= stageLen) return 0;
      if (idx >= drawings!.length - 1) {
        return drawings.length - 1 - (stageLen === 3 ? 2 : 1);
      }
      return idx === 0 ? 0 : idx - 1;
    },
    onPrev: () => () => sliderRef.slidePrev(),
    onNext: () => () => sliderRef.slideNext(),
    slideTo: () => (idx: number) => sliderRef && sliderRef.slideTo(idx),
  };
};

const mapStateToProps = ({ user, canvas }: State) => ({
  drawings: user.drawings,
  currentDrawing: canvas.currentDrawing,
  isMouseDown: canvas.isMouseDown,
});

export const ImageSelector = compose<CombinedProps, PassedProps>(
  withTheme(),
  connect(mapStateToProps),
  withState('state', 'setState', { idx: 0, items: undefined }),
  withHandlers(handlers),
  lifecycle(hooks),
)(ImageSelectorComponent);
