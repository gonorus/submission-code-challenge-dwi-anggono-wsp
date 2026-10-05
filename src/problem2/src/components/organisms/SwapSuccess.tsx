import { Box, Typography, Button } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

export interface SwapSuccessProps {
  onConfirm: () => void;
}

export default function SwapSuccess({ onConfirm }: SwapSuccessProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        width: '100%',
        animation: 'fadeIn 0.5s ease-in-out',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          width: 72,
          height: 72,
          borderRadius: '50%',
          bgcolor: 'rgba(34, 197, 94, 0.15)',
          color: 'success.main',
          mb: 3,
        }}
      >
        <CheckRoundedIcon sx={{ fontSize: 36 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }} role="alert">
        Swap successful
      </Typography>
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onConfirm}
        sx={{
          backgroundColor: '#7b1fa2',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 3px 15px 2px rgba(123, 31, 162, .3)',
          '&:hover': { backgroundColor: '#4a148c' },
        }}
      >
        Confirm
      </Button>
    </Box>
  );
}
