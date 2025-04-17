// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7EB2DD',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        color: 'primary',
      },
    },
  },
});

export default theme;
