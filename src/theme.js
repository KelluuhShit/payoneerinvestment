import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#bf8a36', // Orange
    },
    secondary: {
      main: '#E5C300', // Yellow
    },
    success: {
      main: '#2FDB6D', // Green
    },
    info: {
      main: '#2087EC', // Blue
    },
    warning: {
      main: '#D951D5', // Purple
    },
    error: {
      main: '#FE4600', // Red
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    body2: {
      fontFamily: '"Roboto Mono", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
});

export default theme;