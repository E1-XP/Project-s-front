import React, { ComponentType } from 'react';
import { compose, withState } from 'recompose';

interface Props {

}

export const ImageModalComponent: ComponentType<Props> = (props) => {
    return (<div>
        <h2>OK</h2>
    </div>);
};

export const ImageModal = compose(
    withState('isOpen', 'setIsOpen', true)
)(ImageModalComponent);
