import * as React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Icon from '@material-ui/core/Icon';
import Carousel from 'react-alice-carousel';

import { CombinedProps as Props } from './index';

import config from './../../../config';

import {
  NavWrapper,
  StyledButtonBase,
  ImageContainer,
  StyledExpansionPanelDetails,
} from './style';

const responsive = { 0: { items: 2 }, 445: { items: 3 } };

type GetItemProps = Pick<Props, 'state' | 'drawings' | 'handleImageChange'>;

export const getItems = ({
  drawings,
  state,
  handleImageChange,
}: GetItemProps) =>
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
        data-v={itm.version}
      />
      <GridListTileBar title={itm.name} />
    </StyledButtonBase>
  ));

export const ImageSelectorComponent = ({
  isOpen,
  drawings,
  state,
  onPrev,
  onNext,
  createSliderRef,
  calcCurrThumb,
}: Props) =>
  !state.items ? null : (
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
