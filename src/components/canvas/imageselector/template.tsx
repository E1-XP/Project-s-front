import * as React from 'react';
import styled from 'styled-components';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Icon from '@material-ui/core/Icon';
import Carousel from 'react-alice-carousel';

import { CombinedProps } from './index';

import config from './../../../config';

const NavWrapper = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  height: 100%;
  height: 150px;
  border: none;
  color: #555;
  background-color: transparent;
  padding: 0.5rem;
  & > span {
    font-size: 2rem;
    cursor: pointer;
  }
`;

const StyledButtonBase = styled(ButtonBase)`
  height: 150px;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 150px;
  position: relative;
  & > .alice-carousel,
  .alice-carousel__wrapper {
    height: 150px;
  }
  & .alice-carousel__stage-item:not(.__cloned) {
    max-width: 33%;
  }
  & ${NavWrapper}:first-of-type {
    left: 0;
  }

  & ${NavWrapper}:last-of-type {
    right: 0 !important;
  }
  & img {
    height: 100%;
    width: 100%;
  }
`;

const GridListTileBarWithCurrent = styled(GridListTileBar)<{ color?: string }>`
  & > div {
    color: ${({ color }) => color || '#fff'};
  }
`;

const responsive = { 0: { items: 3 } };

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
          src={`${config.API_URL}/static/images/${itm.id}.jpg`}
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
                responsive={responsive}
                infinite={false}
                dotsDisabled={true}
                mouseDragEnabled={true}
                buttonsDisabled={true}
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
