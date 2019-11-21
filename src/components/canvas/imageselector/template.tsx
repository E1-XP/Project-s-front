import * as React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Icon from '@material-ui/core/Icon';
import Carousel from 'react-alice-carousel';

import { CombinedProps } from './index';

import config from './../../../config';

import {
  NavWrapper,
  StyledButtonBase,
  ImageContainer,
  GridListTileBarWithCurrent,
} from './style';

const responsive = { 0: { items: 2 }, 445: { items: 3 } };

export const ImageSelectorComponent = ({
  isOpen,
  drawings,
  handleImageChange,
  currentDrawing,
  theme,
  state,
  onPrev,
  onNext,
}: CombinedProps) => {
  if (!drawings) return null;

  const getItems = () =>
    drawings.map(itm => (
      <StyledButtonBase onClick={handleImageChange} data-id={itm.id}>
        <img
          src={`${config.API_URL}/static/images/${itm.id}-v${itm.version}.jpg`}
          alt="user drawing"
          draggable={false}
        />
        <GridListTileBarWithCurrent
          title={itm.name}
          color={
            currentDrawing === itm.id ? theme.palette.primary.main : undefined
          }
        />
      </StyledButtonBase>
    ));

  return (
    <ExpansionPanel expanded={isOpen}>
      <ExpansionPanelDetails>
        <ImageContainer>
          {drawings.length ? (
            <>
              <Carousel
                infinite={false}
                dotsDisabled={true}
                mouseTrackingEnabled={true}
                buttonsDisabled={true}
                responsive={responsive}
                items={getItems()}
                slideToIndex={state.idx}
                startIndex={state.idx}
              />
              <NavWrapper>
                <Icon onClick={onPrev}>keyboard_arrow_left</Icon>
              </NavWrapper>
              <NavWrapper>
                <Icon onClick={onNext}>keyboard_arrow_right</Icon>
              </NavWrapper>
            </>
          ) : (
            'no images found'
          )}
        </ImageContainer>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
