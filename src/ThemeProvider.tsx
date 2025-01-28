import { createTheme } from '@mui/material';
import { amber, blue, cyan, green, red } from '@mui/material/colors';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    white: Palette['primary'];
  }
  interface PaletteOptions {
    white?: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: blue[400],
    },
    secondary: {
      main: blue[700],
    },
    success: {
      main: green[500],
    },
    error: {
      main: red[500],
    },
    info: {
      main: cyan[500],
    },
    warning: {
      main: amber[500],
    },
    white: {
      main: '#ffffff',
    },
  },
});
