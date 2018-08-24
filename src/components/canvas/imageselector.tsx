import React, { ComponentType } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { State } from '../../store';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

interface Props {
    drawings: object[]
}

interface PassedProps {
    isOpen: boolean;
    handleImageChange: (e: any) => void;
}

const ImageSelectorComponent: ComponentType<Props & PassedProps> = ({ isOpen,
    drawings, handleImageChange }) => {

    if (!drawings) return null;

    return (<ExpansionPanel expanded={isOpen}>
        <ExpansionPanelDetails >
            <div className="image-container--horizontal">
                <GridList className="image_container__list--horizontal" cols={2.5}>
                    {drawings.length ? drawings.map((itm: any) =>
                        <GridListTile key={itm.id} data-id={itm.id} onClick={handleImageChange}>
                            {/* <img src="" alt=""/> */}
                            <GridListTileBar title={itm.id} />
                        </GridListTile>)
                        : 'no images found'}
                </GridList>
            </div>
        </ExpansionPanelDetails>
    </ExpansionPanel>);
};

const mapStateToProps = ({ user }: State) => ({ drawings: user.drawings });

export const ImageSelector = compose<Props, PassedProps>(
    connect(mapStateToProps)
)(ImageSelectorComponent);
