import { PaletteMode, ThemeOptions } from '@mui/material';

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#7b1fa2',
            light: '#ae52d4',
            dark: '#4a0072',
          },
          secondary: {
            main: '#00e5ff',
          },
          background: {
            default: '#f8fafc',
            paper: 'rgba(255, 255, 255, 0.7)',
          },
        }
      : {
          primary: {
            main: '#646cff',
            light: '#747bff',
            dark: '#535bf2',
          },
          secondary: {
            main: '#41d1ff',
          },
          background: {
            default: '#1b1b1f',
            paper: 'rgba(36, 36, 36, 0.7)',
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(16px)',
          border:
            mode === 'light'
              ? '1px solid rgba(0, 0, 0, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow:
            mode === 'light'
              ? '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
              : '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '12px 24px',
          borderRadius: 12,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.2)',
          '& fieldset': {
            borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
          },
          '&:hover fieldset': {
            borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
          },
          '&.Mui-readOnly': {
            pointerEvents: 'none',
            backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
  },
});
