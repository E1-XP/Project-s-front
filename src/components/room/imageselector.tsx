import React, { ComponentType } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { State } from '../../store';

interface Props {
    drawings: object[]
}

interface PassedProps {
    isOpen: boolean;
    handleImageChange: (e: any) => void;
}

const ImageSelectorComponent: ComponentType<Props & PassedProps> = (props) => {
    const { isOpen, drawings, handleImageChange } = props;

    return (isOpen ? <div
        style={{ border: '1px solid red', height: '4rem' }}>
        {drawings.length ? drawings.map((itm: any) =>
            <li key={itm.id} data-id={itm.id} style={{ float: 'left' }}
                onClick={handleImageChange}>{itm.id}</li>) : 'no images found'}
    </div> : null);
};

const mapStateToProps = ({ user }: State) => ({
    drawings: user.drawings
});

export const ImageSelector = compose<Props, PassedProps>(
    connect(mapStateToProps)
)(ImageSelectorComponent);
