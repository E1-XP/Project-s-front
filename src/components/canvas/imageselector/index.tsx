import { compose, withState, withHandlers } from 'recompose';
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
  onPrev: () => void;
  onNext: () => void;
}

interface PassedProps {
  isOpen: boolean;
  handleImageChange: (e: any) => void;
}

interface CState {
  idx: number;
}

export type CombinedProps = Props & PassedProps;

const handlers = {
  onPrev: ({ setState, state, drawings }: Props) => () => {
    const idx = state.idx === 0 ? drawings.length - 3 : state.idx - 1;
    setState({ ...state, idx });
  },
  onNext: ({ setState, state, drawings }: Props) => () => {
    const idx = state.idx === drawings.length - 3 ? 0 : state.idx + 1;
    setState({ ...state, idx });
  },
};

const mapStateToProps = ({ user, canvas }: State) => ({
  drawings: user.drawings,
  currentDrawing: canvas.currentDrawing,
});

export const ImageSelector = compose<CombinedProps, PassedProps>(
  withTheme(),
  connect(mapStateToProps),
  withState('state', 'setState', { idx: 0 }),
  withHandlers(handlers),
)(ImageSelectorComponent);
