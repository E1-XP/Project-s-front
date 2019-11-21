import * as React from 'react';
import styled from 'styled-components';

import { CombinedProps } from './index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import { PreloaderComponent } from '../../../components/preloader';
import { Heading } from '../../../components/shared/heading';

import { MainContainer, GradientButton, ButtonIcon } from '../../../styles';

import config from '../../../config';

const DrawingsContainer = styled(Grid)`
  height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const CreateNewDrawingTile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  & :first-child {
    font-size: 56px;
  }
`;

const GridListTileWithPointer = styled(GridListTile)`
  cursor: pointer;
`;

export const ImageSelectorComponent = ({
  handleSubmit,
  handleDrawingCreate,
  handleDrawingSelect,
  drawings,
  currentDrawing,
  width,
}: CombinedProps) => {
  const getCols = () => (['sm', 'xs'].includes(width) ? 2 : 4);

  return (
    <MainContainer>
      <Grid container={true} spacing={16}>
        <Grid item={true} xs={12}>
          <Paper>
            <Heading
              text="Select drawing"
              icon="collections"
              justify="center"
            />
            <Typography variant="subtitle1" align="center">
              Select existing image or create new one
            </Typography>
            <DrawingsContainer item={true} xs={12}>
              {drawings ? (
                <GridList cellHeight={160} cols={getCols()}>
                  {[
                    <GridListTileWithPointer
                      key="new-drawing"
                      onClick={handleDrawingCreate}
                    >
                      <CreateNewDrawingTile>
                        <Icon>add</Icon>
                      </CreateNewDrawingTile>
                      ,
                      <GridListTileBar title="new drawing" />
                    </GridListTileWithPointer>,
                  ].concat(
                    drawings.map(itm => (
                      <GridListTileWithPointer
                        data-id={itm.id}
                        key={itm.id}
                        onClick={handleDrawingSelect}
                      >
                        <img
                          src={`${config.API_URL}/static/images/${itm.id}-v${itm.version}.jpg`}
                          alt="user drawing"
                        />
                        {itm.id}
                        <GridListTileBar title={itm.name} />
                      </GridListTileWithPointer>
                    )),
                  )}
                </GridList>
              ) : (
                <PreloaderComponent />
              )}
            </DrawingsContainer>
            <Grid container={true} justify="flex-end">
              <GradientButton
                variant="contained"
                color="primary"
                disabled={!currentDrawing}
                onClick={handleSubmit}
              >
                Create Room
                <ButtonIcon>done</ButtonIcon>
              </GradientButton>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </MainContainer>
  );
};
