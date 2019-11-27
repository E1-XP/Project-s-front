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

import { ImageSelectorComponent } from './template';

interface Props extends HandlersProps, WithTheme {
  drawings: DrawingObject[];
  currentDrawing: number | null;
  state: CState;
  setState: (v: CState) => void;
}

interface HandlersProps {
  createSliderRef: (ref: any) => void;
  onSlideChange: () => void;
  calcCurrThumb: () => number;
  onPrev: () => void;
  onNext: () => void;
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
    calcCurrThumb: ({ drawings, state }: Props) => () => {
      const stageLen = window.innerWidth >= 445 ? 3 : 2;

      if (drawings!.length <= stageLen) return 0;
      if (state.idx >= drawings!.length - 1) {
        return drawings.length - 1 - (stageLen === 3 ? 2 : 1);
      }
      return state.idx === 0 ? 0 : state.idx - 1;
    },
    onPrev: ({ setState, state, drawings }: Props) => () =>
      sliderRef.slidePrev(),
    onNext: ({ setState, state, drawings }: Props) => () =>
      sliderRef.slideNext(),
  };
};

const mapStateToProps = ({ user, canvas }: State) => ({
  drawings: user.drawings,
  currentDrawing: canvas.currentDrawing,
});

export const ImageSelector = compose<CombinedProps, PassedProps>(
  withTheme(),
  connect(mapStateToProps),
  withState('state', 'setState', { idx: 0, items: undefined }),
  withHandlers(handlers),
  lifecycle(hooks),
)(ImageSelectorComponent);
