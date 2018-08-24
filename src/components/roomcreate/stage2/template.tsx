import React, { ComponentType } from 'react';

import { Props, PassedProps } from './index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

export const ImageSelectorComponent: ComponentType<Props & PassedProps> = ({ handleSubmit,
    handleDrawingCreate, handleDrawingSelect, drawings, currentDrawing }) => {

    return (<main id="roomcreate" className="container">
        <Grid container spacing={16} >
            <Grid item xs={12} >
                <Paper className="paper">
                    <Typography variant="display1" align="center" >
                        Select drawing
                    </Typography>
                    <Typography variant="subheading" align="center" >
                        Select existing image or create new one
                </Typography>
                    <Grid item xs={12} className="griditem--center container--drawings mtop--2" >
                        {drawings ?
                            (<GridList cellHeight={160} cols={4} className="mbottom--2">
                                {[<GridListTile key={'new-drawing'}
                                    onClick={handleDrawingCreate}>
                                    {/* <img src={tile.img} alt={tile.title} /> */}
                                    {'new'}
                                    <GridListTileBar title={'new'} />
                                </GridListTile>
                                ].concat(drawings.map((itm: any) =>
                                    <GridListTile data-id={itm.id} key={itm.id}
                                        onClick={handleDrawingSelect}>
                                        {/* <img src={tile.img} alt={tile.title} /> */}
                                        {itm.id}
                                        <GridListTileBar title={itm.id} />
                                    </GridListTile>))}
                            </GridList>)
                            : 'loading...'}
                    </Grid>
                    <Grid container justify="flex-end" className="mtop--2">
                        <Button variant="contained" color="primary" disabled={!currentDrawing}
                            onClick={handleSubmit} >Create Room
                            <Icon className="icon--mleft">done</Icon>
                        </Button>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    </main>);
};
