import { Container } from '@mui/material';
import SwapCard from '@organisms/SwapCard';

export default function SwapPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}
    >
      <SwapCard />
    </Container>
  );
}
