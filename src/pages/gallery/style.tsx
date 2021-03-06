import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

export const Img = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: -1;
  border: 1px solid #ccc;
`;

export const PaperWithMinHeight = styled(Paper)`
  /* min-height: 1020px; */
  padding-bottom: 2rem !important;
`;

export const NoImagesPlaceholder = styled.div`
  width: 100%;
  display: block;
  align-items: center;
  justify-content: center;
  height: calc(100vh / 2);
  display: flex;
`;

export const NavContainer = styled.div`
  width: 100%;
  height: 150px;
  position: relative;
  padding-top: 1rem;

  & > .alice-carousel,
  .alice-carousel__wrapper {
    height: 150px;
    cursor: grab;
  }

  & .alice-carousel__stage-item:not(.__cloned) {
    max-width: 50%;
    @media only screen and (min-width: 445px) {
      max-width: 33%;
    }
  }

  & figure {
    margin: 0;
    height: 100%;
  }
`;
