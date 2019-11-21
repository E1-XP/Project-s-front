import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import GridListTileBar from '@material-ui/core/GridListTileBar';

export const NavWrapper = styled.div`
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

export const StyledButtonBase = styled(ButtonBase)`
  height: 150px;
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 150px;
  position: relative;
  & > .alice-carousel,
  .alice-carousel__wrapper {
    height: 150px;
  }
  & .alice-carousel__stage-item:not(.__cloned) {
    max-width: 50%;
    @media only screen and (min-width: 445px) {
      max-width: 33%;
    }
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

export const GridListTileBarWithCurrent = styled(GridListTileBar)<{
  color?: string;
}>`
  & > div {
    color: ${({ color }) => color || '#fff'};
  }
`;
