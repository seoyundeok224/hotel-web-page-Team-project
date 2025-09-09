import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#212121', // A dark, elegant gray
    },
    secondary: {
      main: '#BDBDBD', // A light gray for accents
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 700,
    },
  },
});

export default theme;
