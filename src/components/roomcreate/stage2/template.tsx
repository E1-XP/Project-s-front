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

import { PreloaderComponent } from './../../preloader';

import { MainContainer, GradientButton, ButtonIcon } from './../../../styles';

import config from './../../../config';

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

export const ImageSelectorComponent = ({
  handleSubmit,
  handleDrawingCreate,
  handleDrawingSelect,
  drawings,
  currentDrawing,
}: CombinedProps) => {
  return (
    <MainContainer>
      <Grid container={true} spacing={16}>
        <Grid item={true} xs={12}>
          <Paper>
            <Typography variant="h4" align="center">
              Select drawing
            </Typography>
            <Typography variant="subtitle1" align="center">
              Select existing image or create new one
            </Typography>
            <DrawingsContainer item={true} xs={12}>
              {drawings ? (
                <GridList cellHeight={160} cols={4}>
                  {[
                    <GridListTile
                      key="new-drawing"
                      onClick={handleDrawingCreate}
                    >
                      <CreateNewDrawingTile>
                        <Icon>add</Icon>
                      </CreateNewDrawingTile>
                      ,
                      <GridListTileBar title="new drawing" />
                    </GridListTile>,
                  ].concat(
                    drawings.map(itm => (
                      <GridListTile
                        data-id={itm.id}
                        key={itm.id}
                        onClick={handleDrawingSelect}
                      >
                        <img
                          src={`${config.API_URL}/static/images/${itm.id}.jpg`}
                          alt="user drawing"
                        />
                        {itm.id}
                        <GridListTileBar title={itm.name} />
                      </GridListTile>
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
