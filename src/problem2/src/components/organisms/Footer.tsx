import { Box, Link, Typography } from '@mui/material';

const linkSx = {
  color: 'inherit',
  textDecoration: 'underline',
  textDecorationStyle: 'dotted',
  textUnderlineOffset: '2px',
  '&:hover': { color: 'text.secondary' },
} as const;

export default function Footer() {
  return (
    <Box component="footer" sx={{ px: 2, pb: 3, pt: 1, mt: 'auto', textAlign: 'center' }}>
      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 12 }}>
        Demo build — balances are simulated and no funds move. Prices from{' '}
        <Link
          href="https://interview.switcheo.com/prices.json"
          target="_blank"
          rel="noreferrer"
          sx={linkSx}
        >
          interview.switcheo.com
        </Link>
        .
      </Typography>
    </Box>
  );
}
