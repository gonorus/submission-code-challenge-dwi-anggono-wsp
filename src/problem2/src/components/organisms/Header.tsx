import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ThemeToggle from '@molecules/ThemeToggle';

export default function Header() {
  const theme = useTheme();

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 },
        py: 2,
        bgcolor: 'transparent',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          component="img"
          src="/favicon.svg"
          alt="App Icon"
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.45)}`,
            backgroundColor: theme.palette.mode === 'dark' ? '#000' : 'transparent',
          }}
        />
        <Typography component="span" sx={{ fontWeight: 600, letterSpacing: '-0.025em', ml: 0.5 }}>
          Swap
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ThemeToggle />
      </Box>
    </Box>
  );
}
