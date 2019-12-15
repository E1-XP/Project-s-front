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

interface Props extends HandlersProps, WithTheme {
  drawings: DrawingObject[];
  currentDrawing: number | null;
  state: CState;
  setState: (v: CState) => void;
  isMouseDown: boolean;
  currentThumbnail: null | string;
}

interface HandlersProps {
  createSliderRef: (ref: any) => void;
  getSliderRef: () => CanvasRenderingContext2D;
  setItems: (
    drawings: CombinedProps['drawings'],
    state: CombinedProps['state'],
    handleImageChange: CombinedProps['handleImageChange'],
  ) => void;
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
    const {
      state,
      setState,
      drawings,
      handleImageChange,
      currentDrawing,
      calcCurrThumb,
    } = this.props;

    if (!drawings) return;

    const idx = drawings.findIndex(itm => itm.id === currentDrawing!);

    const newState = { ...state, idx };
    setState(newState);

    this.props.setItems(drawings, newState, handleImageChange);

    requestAnimationFrame(() => {
      this.props.onSlideChange();
      this.props.slideTo(calcCurrThumb(idx));
    });
  },
  UNSAFE_componentWillReceiveProps(nextP) {
    const { drawings, state, handleImageChange, currentDrawing } = nextP;
    if (!drawings) return;

    const drawingsQuantityChanged =
      !this.props.drawings || drawings.length !== this.props.drawings.length;
    const shouldReplaceThumbnail =
      !this.props.isMouseDown &&
      this.props.currentThumbnail !== nextP.currentThumbnail;

    const idx = drawings.findIndex(itm => itm.id === currentDrawing!);

    if (drawingsQuantityChanged) {
      nextP.setItems(drawings, state, handleImageChange);

      requestAnimationFrame(() => {
        nextP.onSlideChange();
        nextP.slideTo(nextP.calcCurrThumb(idx));
      });
    } else if (shouldReplaceThumbnail) {
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
    getSliderRef: () => () => sliderRef,
    setItems: ({ setState }: CombinedProps) => (
      drawings: CombinedProps['drawings'],
      state: CombinedProps['state'],
      handleImageChange: CombinedProps['handleImageChange'],
    ) => {
      const items = getItems({
        drawings,
        state,
        handleImageChange,
      });

      setState({ ...state, items });
    },
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
    replaceImage: ({ drawings, currentThumbnail, state }: Props) => () => {
      if (!currentThumbnail || !sliderRef) return;

      const items = sliderRef.rootComponent.querySelectorAll(
        'ul > li:not(.__cloned) img',
      );
      if (!items) return;

      drawings.forEach(
        (itm, i) => i === state.idx && (items[i].src = currentThumbnail),
      );
    },
    calcCurrThumb: ({ drawings, state }: Props) => (idx = state.idx) => {
      const stageLen = window.innerWidth >= 445 ? 3 : 2;

      if (drawings.length <= stageLen) return 0;

      if (idx >= drawings.length - 1) {
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
  currentThumbnail: canvas.cachedCurrDrawingThumb,
});

export const ImageSelector = compose<CombinedProps, PassedProps>(
  withTheme(),
  connect(mapStateToProps),
  withState('state', 'setState', { idx: 0, items: undefined }),
  withHandlers(handlers),
  lifecycle(hooks),
)(ImageSelectorComponent);
