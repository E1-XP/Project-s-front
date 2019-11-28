import * as React from 'react';
import styled from 'styled-components';

import ButtonBase from '@material-ui/core/ButtonBase';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

export const StyledExpansionPanelDetails = styled(ExpansionPanelDetails)`
  @media only screen and (max-width: 445px) {
    padding: 0 !important;
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 150px;
  display: flex;

  & > .alice-carousel {
    width: calc(100% - (2 * 48px));
  }

  & > .alice-carousel,
  .alice-carousel__wrapper {
    height: 150px;
  }

  .alice-carousel__wrapper {
    border: 1px solid #333;
  }

  .alice-carousel__stage-item:not(.__cloned) {
    width: calc(100% / 3) !important;

    @media only screen and (max-width: 445px) {
      width: 50% !important;
    }
  }

  & img {
    height: 100%;
    width: 100%;
  }
`;

export const StyledButtonBase = styled(ButtonBase)`
  height: 150px;
  cursor: grab !important;

  & > img {
    border: 1px solid #ccc;
  }
`;

export const NavWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  height: 150px;
  border: none;
  color: #ccc;
  background-color: #333;
  padding: 0.5rem;
  cursor: pointer;

  & > span {
    font-size: 2rem;
    cursor: pointer;
  }
`;
