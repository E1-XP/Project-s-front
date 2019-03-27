import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {},
  overrides: {
    MuiAppBar: {
      root: {
        padding: 'initial',
      },
    },
    MuiExpansionPanel: {
      root: {
        padding: 'initial',
      },
    },
    MuiPaper: {
      root: {
        padding: '1rem',
      },
    },
  },
});
