import React from 'react';

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
import {
  Img,
  NoImagesPlaceholder,
  NavContainer,
  PaperWithMinHeight,
} from './style';

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
          src={`${config.API_URL}/static/images/${itm.id}-${itm.version}.jpg`}
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
                  mouseTrackingEnabled={true}
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
                      mouseTrackingEnabled={true}
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
