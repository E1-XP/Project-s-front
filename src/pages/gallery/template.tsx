import React from 'react';
import styled from 'styled-components';

import { Props } from './index';
import config from '../../config';

import Carousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { MainContainer } from '../../styles';

import { Heading } from '../../components/shared/heading';
import { PreloaderComponent } from '../../components/preloader';

const Img = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: -1;
`;

const PaperWithMinHeight = styled(Paper)`
  /* min-height: 1020px; */
`;

const NoImagesPlaceholder = styled.div`
  width: 100%;
  display: block;
  align-items: center;
  justify-content: center;
  height: calc(100vh / 2);
  display: flex;
`;

const NavContainer = styled.div`
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
  & figure {
    margin: 0;
    height: 100%;
  }
`;

const responsive = { 0: { items: 2 }, 445: { items: 3 } };

export const GalleryComponent = ({
  setState,
  state,
  drawings,
  slidePrev,
  slideNext,
  onSlideChanged,
  slideTo,
}: Props) => {
  const calcCurrThumb = () => {
    const itmLen = window.innerWidth >= 445 ? 3 : 2;

    if (drawings!.length <= itmLen) return 0;
    if (state.idx >= drawings!.length - 1) {
      return state.idx - (itmLen === 3 ? 2 : 1);
    }
    return state.idx === 0 ? 0 : state.idx - 1;
  };

  const getGalleryItems = (onClick?: any) => {
    return drawings!.map((itm, i) => (
      <figure onClick={onClick ? () => onClick(i) : undefined}>
        <Img
          src={`${config.API_URL}/static/images/${itm.id}.jpg`}
          alt="user drawing"
        />
      </figure>
    ));
  };

  const getPlaceholder = () => [
    <NoImagesPlaceholder key={0}>
      <Typography variant="h5">No drawings found.</Typography>
    </NoImagesPlaceholder>,
  ];

  if (state.items === undefined && drawings) {
    setState({ ...state, items: getGalleryItems() });
  }

  return (
    <MainContainer>
      <Grid container={true} spacing={16}>
        <Grid item={true} xs={12}>
          <PaperWithMinHeight>
            <Heading text="Gallery" icon="image" justify="center" />
            {drawings ? (
              <>
                <Carousel
                  dotsDisabled={true}
                  buttonsDisabled={true}
                  items={drawings.length ? state.items : getPlaceholder()}
                  slideToIndex={state.idx}
                  onSlideChanged={onSlideChanged}
                  mouseDragEnabled={true}
                  infinite={false}
                />
                <Grid container={true} direction="row" justify="space-between">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={slidePrev}
                    disabled={state.idx <= 0}
                  >
                    Previous
                  </Button>
                  <Typography variant="h6" align="center">
                    {drawings[state.idx] ? drawings[state.idx].name : ''}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={slideNext}
                    disabled={state.idx >= drawings.length - 1}
                  >
                    Next
                  </Button>
                </Grid>
                {!!drawings.length && (
                  <NavContainer>
                    <Carousel
                      mouseDragEnabled={true}
                      startIndex={calcCurrThumb()}
                      dotsDisabled={true}
                      responsive={responsive}
                      buttonsDisabled={true}
                      infinite={false}
                      slideToIndex={state.idx - 1}
                      items={getGalleryItems(slideTo)}
                    />
                  </NavContainer>
                )}
              </>
            ) : (
              <PreloaderComponent />
            )}
          </PaperWithMinHeight>
        </Grid>
      </Grid>
    </MainContainer>
  );
};
