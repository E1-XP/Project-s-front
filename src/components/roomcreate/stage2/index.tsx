import { compose, lifecycle, ReactLifeCycleFunctions } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { State } from './../../../store';
import { actions } from '../../../actions';

import { ImageSelectorComponent } from './template';

export interface Props {
  drawings: string[];
  initGetImagesFromTheServer: () => Dispatch;
}

export interface PassedProps {
  handleSubmit: () => void;
  handleDrawingCreate: () => void;
  handleDrawingSelect: (e: any) => void;
  currentDrawing: string | null;
}

export type CombinedProps = Props & PassedProps;

const hooks: ReactLifeCycleFunctions<CombinedProps, {}> = {
  componentDidMount() {
    this.props.initGetImagesFromTheServer();
  },
};

const mapStateToProps = ({ user }: State) => ({
  drawings: user.drawings,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initGetImagesFromTheServer: () =>
    dispatch(actions.canvas.initGetImagesFromServer()),
});

export const ImageSelector = compose<CombinedProps, PassedProps>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle(hooks),
)(ImageSelectorComponent);
