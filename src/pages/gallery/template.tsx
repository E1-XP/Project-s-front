import React from 'react';
import Carousel from 'react-alice-carousel';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { Props } from './index';

import { GalleryItem } from './galleryItem';

import { MainContainer } from '../../styles';

import { Heading } from '../../components/shared/heading';
import { PreloaderComponent } from '../../components/preloader';
import { NoImagesPlaceholder, NavContainer, PaperWithMinHeight } from './style';

const responsive = { 0: { items: 2 }, 445: { items: 3 } };

const getPlaceholder = () => [
  <NoImagesPlaceholder key={0}>
    <Typography variant="h5">No drawings found.</Typography>
  </NoImagesPlaceholder>,
];

export const GalleryComponent = ({
  setState,
  state,
  drawings,
  slidePrev,
  slideNext,
  onSlideChanged,
  slideTo,
  createThumbSliderRef,
}: Props) => {
  const calcCurrThumb = () => {
    const stageLen = window.innerWidth >= 445 ? 3 : 2;

    if (drawings!.length <= stageLen) return 0;
    if (state.idx >= drawings!.length - 1) {
      return state.idx - (stageLen === 3 ? 2 : 1);
    }
    return state.idx === 0 ? 0 : state.idx - 1;
  };

  const getGalleryItems = (onClick?: any) =>
    drawings!.map((itm, i) => (
      <GalleryItem activeIdx={state.idx} data={itm} i={i} onClick={onClick} />
    ));

  if (state.items === undefined && drawings) {
    setState({
      ...state,
      items: getGalleryItems(),
      thumbItems: getGalleryItems(slideTo),
    });
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
                      ref={createThumbSliderRef}
                      mouseTrackingEnabled={true}
                      startIndex={calcCurrThumb()}
                      dotsDisabled={true}
                      responsive={responsive}
                      buttonsDisabled={true}
                      infinite={false}
                      slideToIndex={state.idx - 1}
                      items={state.thumbItems}
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
