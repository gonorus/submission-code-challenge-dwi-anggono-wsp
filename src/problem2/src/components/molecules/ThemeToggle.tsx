import { useContext } from 'react';
import { IconButton } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { ColorModeContext } from '@contexts/ColorModeContext';

export default function ThemeToggle() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isDark = theme.palette.mode === 'dark';

  return (
    <IconButton
      onClick={colorMode.toggleColorMode}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      size="small"
      sx={{
        borderRadius: 2,
        p: 1,
        color: 'text.secondary',
        '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.08), color: 'text.primary' },
      }}
    >
      {isDark ? (
        <LightModeOutlinedIcon fontSize="small" />
      ) : (
        <DarkModeOutlinedIcon fontSize="small" />
      )}
    </IconButton>
  );
}
