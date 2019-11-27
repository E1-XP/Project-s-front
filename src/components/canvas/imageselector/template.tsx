import * as React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Icon from '@material-ui/core/Icon';
import Carousel from 'react-alice-carousel';

import { CombinedProps } from './index';

import config from './../../../config';

import {
  NavWrapper,
  StyledButtonBase,
  ImageContainer,
  StyledExpansionPanelDetails,
} from './style';

const responsive = { 0: { items: 2 }, 445: { items: 3 } };

export const ImageSelectorComponent = ({
  isOpen,
  drawings,
  handleImageChange,
  state,
  setState,
  onPrev,
  onNext,
  createSliderRef,
  calcCurrThumb,
}: CombinedProps) => {
  const getItems = () =>
    drawings.map((itm, i) => (
      <StyledButtonBase
        className={state.idx === i ? 'img-active' : undefined}
        onClick={handleImageChange}
        data-id={itm.id}
        key={itm.id}
      >
        <img
          src={`${config.API_URL}/static/images/${itm.id}-v${itm.version}.jpg`}
          alt="user drawing"
          draggable={false}
          data-idx={itm.id}
        />
        <GridListTileBar title={itm.name} />
      </StyledButtonBase>
    ));

  if (!state.items) {
    setState({
      ...state,
      items: getItems(),
    });
  }

  return (
    <ExpansionPanel expanded={isOpen}>
      <StyledExpansionPanelDetails>
        <ImageContainer>
          <NavWrapper onClick={onPrev}>
            <Icon>keyboard_arrow_left</Icon>
          </NavWrapper>
          {drawings.length ? (
            <>
              <Carousel
                ref={createSliderRef}
                infinite={false}
                dotsDisabled={true}
                mouseTrackingEnabled={true}
                buttonsDisabled={true}
                responsive={responsive}
                items={state.items}
                slideToIndex={calcCurrThumb()}
                startIndex={state.idx}
              />
              <NavWrapper onClick={onNext}>
                <Icon>keyboard_arrow_right</Icon>
              </NavWrapper>
            </>
          ) : (
            'no images found'
          )}
        </ImageContainer>
      </StyledExpansionPanelDetails>
    </ExpansionPanel>
  );
};
