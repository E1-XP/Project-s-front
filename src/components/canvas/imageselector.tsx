import * as React from 'react';
import { compose, onlyUpdateForKeys } from 'recompose';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { State, DrawingObject } from '../../store/interfaces';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ButtonBase from '@material-ui/core/ButtonBase';
import { withTheme, WithTheme } from '@material-ui/core/styles';

import config from './../../config';

interface Props extends WithTheme {
  drawings: DrawingObject[];
  currentDrawing: number | null;
}

interface PassedProps {
  isOpen: boolean;
  handleImageChange: (e: any) => void;
}

type CombinedProps = Props & PassedProps;

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  overflow: hidden;
  width: 100%;
`;

const GridListHorizontal = styled(GridList)`
  flex-wrap: nowrap !important;
  width: 100%;
  transform: translateZ(0);
`;

const GridListTileWithButton = styled(GridListTile)`
  & button {
    width: 100% !important;
    height: 100% !important;
  }

  & img {
    width: 100% !important;
  }
`;

const GridListTileBarWithCurrent = styled(GridListTileBar)<{ color?: string }>`
  & > div {
    color: ${({ color }) => color || '#fff'};
  }
`;

const ImageSelectorComponent = ({
  isOpen,
  drawings,
  handleImageChange,
  currentDrawing,
  theme,
}: CombinedProps) => {
  if (!drawings) return null;

  return (
    <ExpansionPanel expanded={isOpen}>
      <ExpansionPanelDetails>
        <ImageContainer>
          <GridListHorizontal cols={2.5}>
            {drawings.length
              ? drawings.map(itm => (
                  <GridListTileWithButton data-id={itm.id} key={itm.id}>
                    <ButtonBase onClick={handleImageChange}>
                      <img
                        src={`${config.API_URL}/static/images/${itm.id}.jpg`}
                        alt="user drawing"
                      />
                      <GridListTileBarWithCurrent
                        title={itm.name}
                        color={
                          currentDrawing === itm.id
                            ? theme.palette.primary.main
                            : undefined
                        }
                      />
                    </ButtonBase>
                  </GridListTileWithButton>
                ))
              : 'no images found'}
          </GridListHorizontal>
        </ImageContainer>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const mapStateToProps = ({ user, canvas }: State) => ({
  drawings: user.drawings,
  currentDrawing: canvas.currentDrawing,
});

export const ImageSelector = compose<CombinedProps, PassedProps>(
  withTheme(),
  connect(mapStateToProps),
)(ImageSelectorComponent);
