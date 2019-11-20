import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

export const GridWithPadding = styled(Grid)`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

export const OuterGrid = styled(Grid)`
  @media only screen and (max-width: 1280px) {
    margin: 0 auto !important;
  }
  @media only screen and (min-width: 960px) and (max-width: 1280px) {
    & > div:first-of-type {
      padding-right: 8px !important;
    }
    & > div:last-of-type {
      padding-left: 8px !important;
    }
  }

  @media only screen and (max-width: 960px) {
    & > div:first-of-type {
      padding-bottom: 8px !important;
    }
    & > div:last-of-type {
      padding-top: 8px !important;
    }
  }
`;

export const NestedGrid = styled(Grid)`
  @media only screen and (max-width: 1280px) {
    padding: 0 !important;
  }
`;

export const GridWithWidth = styled(Grid)`
  width: 100% !important;
`;
