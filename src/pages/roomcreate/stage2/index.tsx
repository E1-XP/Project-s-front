import { compose, lifecycle, ReactLifeCycleFunctions } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import withWidth, { WithWidth } from '@material-ui/core/withWidth';

import { State, DrawingObject } from '../../../store/interfaces';
import { actions } from '../../../actions';

import { ImageSelectorComponent } from './template';

export interface Props extends WithWidth {
  drawings: DrawingObject[];
  initGetImagesFromTheServer: () => Dispatch;
}

export interface PassedProps {
  handleSubmit: () => void;
  handleDrawingCreate: () => void;
  handleDrawingSelect: (e: any) => void;
  currentDrawing: number | null;
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
  withWidth(),
  lifecycle(hooks),
)(ImageSelectorComponent);
