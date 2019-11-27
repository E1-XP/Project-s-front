import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
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
        '@media (max-width: 445px)': {
          padding: '8px',
        },
      },
    },
  },
});
