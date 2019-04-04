import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: { main: `#ff00cc` },
    secondary: { main: `#333399` },
  },
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
