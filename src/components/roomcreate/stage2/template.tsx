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
    handleDrawingCreate, handleDrawingSelect, drawings }) => {

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
                    <Grid item xs={6} className="griditem--center mtop--2" >
                        {drawings ?
                            (drawings.length ?
                                (<GridList cellHeight={180}>
                                    {drawings.map((itm: any) =>
                                        <GridListTile data-id={itm.id} key={itm.id}
                                            onClick={handleDrawingSelect}>
                                            {/* <img src={tile.img} alt={tile.title} /> */}
                                            {itm.id}
                                            <GridListTileBar title={itm.id} />
                                        </GridListTile>)}
                                </GridList>) :
                                'no images found')
                            : 'loading...'}
                        <Button variant="contained" color="primary"
                            onClick={handleDrawingCreate} >Create New Drawing</Button>
                        <Button variant="contained" color="primary"
                            onClick={handleSubmit} >Create Room</Button>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    </main>);
};
