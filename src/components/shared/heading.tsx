import * as React from 'react';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

import { HeadlineIcon, HeadingSection } from './../../styles';

type Justify =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

interface Props {
  icon: string;
  text: string;
  justify?: Justify;
}

export const Heading = ({ text, icon, justify }: Props) => (
  <HeadingSection container={true} justify={justify} alignItems="center">
    <HeadlineIcon>{icon}</HeadlineIcon>
    <Typography align="center" variant="h4">
      {text}
    </Typography>
  </HeadingSection>
);
