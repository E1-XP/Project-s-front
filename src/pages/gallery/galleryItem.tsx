import * as React from 'react';

import { DrawingObject } from './../../store/interfaces';
import config from '../../config';

import { Img } from './style';

interface Props extends PassedProps {}

interface PassedProps {
  data: DrawingObject;
  i: number;
  activeIdx: number;
  onClick?: (i: number) => void;
}

const figureStyle = { cursor: 'grab', userSelect: 'none' } as any;

export const GalleryItem = ({ onClick, i, data, activeIdx }: Props) => (
  <figure
    style={figureStyle}
    className={onClick && activeIdx === i ? 'img-active' : undefined}
    onClick={onClick ? e => onClick(i) : undefined}
    key={data.id}
  >
    <Img
      src={`${config.API_URL}/static/images/${data.id}-v${data.version}.jpg`}
      alt="user drawing"
    />
  </figure>
);
