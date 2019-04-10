import React from 'react';
import styled from 'styled-components';

import { Props } from './index';
import config from './../../config';

import Carousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { MainContainer, HeadlineIcon } from './../../styles';

import { PreloaderComponent } from './../shared/preloader';

const Img = styled.img`
  width: 100%;
  position: relative;
  z-index: -1;
`;

const PaperWithMinHeight = styled(Paper)`
  /* min-height: 1020px; */
`;

const NoImagesPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  align-items: center;
  justify-content: center;

  & :first-child {
    text-transform: uppercase;
  }
`;

export const GalleryComponent = ({
  setState,
  state,
  drawings,
  slidePrev,
  slideNext,
  onSlideChanged,
  slideTo,
}: Props) => {
  const responsive = { 0: { items: 3 } };

  const calcCurrThumb = () => {
    return state.idx === 0 ? 0 : state.idx - 1;
  };

  const galleryItems = (onClick?: any) => {
    return drawings!.map((itm, i) => (
      <div key={i} onClick={onClick ? () => onClick(i) : undefined}>
        <Img
          src={`${config.API_URL}/static/images/${itm.id}.jpg`}
          alt="user drawing"
        />
      </div>
    ));
  };

  const getPlaceholder = () => [
    <NoImagesPlaceholder key={0}>No drawings found.</NoImagesPlaceholder>,
  ];

  if (state.items === undefined && drawings) {
    setState({ ...state, items: galleryItems() });
  }

  return (
    <MainContainer>
      <Grid container={true} spacing={16}>
        <Grid item={true} xs={12}>
          <PaperWithMinHeight>
            <Grid container={true} justify="center" alignItems="center">
              <HeadlineIcon>image</HeadlineIcon>
              <Typography variant="h4">Gallery </Typography>
            </Grid>
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
                    {drawings[state.idx].name}
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
                <Carousel
                  mouseDragEnabled={true}
                  startIndex={calcCurrThumb()}
                  dotsDisabled={true}
                  buttonsDisabled={true}
                  infinite={false}
                  responsive={responsive}
                  slideToIndex={state.idx - 1}
                  items={galleryItems(slideTo)}
                />
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
