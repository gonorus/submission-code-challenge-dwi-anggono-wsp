import { Box, Typography, CircularProgress } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import TokenIcon from '@atoms/TokenIcon';

export interface SwapProgressProps {
  payAmount: string;
  payToken: string;
  receiveAmount: string;
  receiveToken: string;
}

export default function SwapProgress({
  payAmount,
  payToken,
  receiveAmount,
  receiveToken,
}: SwapProgressProps) {
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
          position: 'relative',
          width: 136,
          height: 136,
          display: 'grid',
          placeItems: 'center',
          mb: 3,
        }}
      >
        <CircularProgress
          size={136}
          thickness={2}
          sx={{ position: 'absolute', inset: 0, color: 'primary.light' }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            '@keyframes arrowFlow': {
              '0%, 100%': { transform: 'translateX(-2px)', opacity: 0.4 },
              '50%': { transform: 'translateX(3px)', opacity: 1 },
            },
            '@keyframes iconPulse': {
              '0%, 100%': { transform: 'scale(0.92)', opacity: 0.75 },
              '50%': { transform: 'scale(1)', opacity: 1 },
            },
            '& .swap-icon': { animation: 'iconPulse 1.4s ease-in-out infinite' },
            '& .swap-icon-to': { animationDelay: '0.7s' },
            '& .swap-arrow': { animation: 'arrowFlow 1.4s ease-in-out infinite' },
            '@media (prefers-reduced-motion: reduce)': {
              '& .swap-icon, & .swap-arrow': { animation: 'none' },
            },
          }}
        >
          <Box className="swap-icon">
            <TokenIcon symbol={payToken} size={36} />
          </Box>
          <ArrowForwardRoundedIcon
            className="swap-arrow"
            sx={{ fontSize: 18, color: 'text.secondary' }}
          />
          <Box className="swap-icon swap-icon-to">
            <TokenIcon symbol={receiveToken} size={36} />
          </Box>
        </Box>
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
        Swapping...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {payAmount} {payToken} → {receiveAmount} {receiveToken}
      </Typography>
    </Box>
  );
}
