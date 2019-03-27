import * as React from 'react';
import { compose, onlyUpdateForKeys } from 'recompose';
import { connect } from 'react-redux';

import { State, DrawingObject } from '../../store/interfaces';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import config from './../../config';

interface Props {
  drawings: DrawingObject[];
}

interface PassedProps {
  isOpen: boolean;
  handleImageChange: (e: any) => void;
}

type CombinedProps = Props & PassedProps;

const ImageSelectorComponent = ({
  isOpen,
  drawings,
  handleImageChange,
}: CombinedProps) => {
  if (!drawings) return null;

  return (
    <ExpansionPanel expanded={isOpen}>
      <ExpansionPanelDetails>
        <div className="image-container--horizontal">
          <GridList className="image_container__list--horizontal" cols={2.5}>
            {drawings.length
              ? drawings.map((itm: any) => (
                  <GridListTile
                    key={itm.id}
                    data-id={itm.id}
                    onClick={handleImageChange}
                  >
                    <img
                      src={`${config.API_URL}/static/images/${itm.id}.jpg`}
                      alt="user drawing"
                    />
                    <GridListTileBar title={itm.id} />
                  </GridListTile>
                ))
              : 'no images found'}
          </GridList>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const mapStateToProps = ({ user }: State) => ({ drawings: user.drawings });

export const ImageSelector = compose<CombinedProps, PassedProps>(
  connect(mapStateToProps),
  onlyUpdateForKeys(['isOpen', 'drawings']),
)(ImageSelectorComponent);
