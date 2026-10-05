import { useState, memo } from 'react';
import { Avatar, Skeleton } from '@mui/material';

import { getIconUrl } from '@utils/icon';

export interface TokenIconProps {
  symbol: string;
  size?: number;
}

/**
 * Standalone Skeleton component for TokenIcon.
 * Useful for displaying a loading state before the token symbol is known (e.g. during API fetch).
 */
export const TokenIconSkeleton = memo(function TokenIconSkeleton({
  size = 24,
}: Pick<TokenIconProps, 'size'>) {
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <Skeleton variant="circular" width="100%" height="100%" animation="wave" />
    </Avatar>
  );
});

const TokenIcon = memo(function TokenIcon({ symbol, size = 24 }: TokenIconProps) {
  const [imgState, setImgState] = useState({
    symbol,
    hasError: false,
    isLoading: !!symbol,
  });

  // Derived state: Sync state during render to avoid useEffect race conditions
  if (imgState.symbol !== symbol) {
    setImgState({ symbol, hasError: false, isLoading: !!symbol });
  }

  const iconUrl = getIconUrl(symbol);

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      {imgState.hasError || !symbol ? (
        symbol ? (
          symbol.substring(0, 1)
        ) : (
          '?'
        )
      ) : (
        <>
          {imgState.isLoading && (
            <Skeleton variant="circular" width="100%" height="100%" animation="wave" />
          )}
          <img
            key={symbol}
            src={iconUrl}
            alt={symbol}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: imgState.isLoading ? 'none' : 'block',
            }}
            onLoad={() => setImgState((prev) => ({ ...prev, isLoading: false }))}
            onError={() => setImgState((prev) => ({ ...prev, hasError: true, isLoading: false }))}
          />
        </>
      )}
    </Avatar>
  );
});

export default TokenIcon;
