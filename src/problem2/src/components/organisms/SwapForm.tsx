import { FormEvent } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AmountInput from '@molecules/AmountInput';
import TokenSelector from '@molecules/TokenSelector';

export interface SwapFormProps {
  amount: string;
  onAmountChange: (val: string) => void;
  outputAmount: string;
  fromCurrency: string;
  onFromCurrencyChange: (val: string) => void;
  availableForPay: string[];
  toCurrency: string;
  onToCurrencyChange: (val: string) => void;
  availableForReceive: string[];
  onSwapCurrencies: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isFormValid: boolean;
  buttonText: string;
}

export default function SwapForm({
  amount,
  onAmountChange,
  outputAmount,
  fromCurrency,
  onFromCurrencyChange,
  availableForPay,
  toCurrency,
  onToCurrencyChange,
  availableForReceive,
  onSwapCurrencies,
  onSubmit,
  isFormValid,
  buttonText,
}: SwapFormProps) {
  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 600 }}>
        Quick Swap
      </Typography>

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        role="form"
      >
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', width: '100%' }}>
          <AmountInput label="You Pay" value={amount} onChange={onAmountChange} />
          <TokenSelector
            label="Pay Token"
            value={fromCurrency}
            onChange={onFromCurrencyChange}
            availableTokens={availableForPay}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            my: -1,
            zIndex: 1,
            position: 'relative',
          }}
        >
          <IconButton
            aria-label="Swap currencies"
            onClick={onSwapCurrencies}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <SwapVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', width: '100%' }}>
          <AmountInput label="You Receive" value={outputAmount} readOnly={true} />
          <TokenSelector
            label="Receive Token"
            value={toCurrency}
            onChange={onToCurrencyChange}
            availableTokens={availableForReceive}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={!isFormValid}
            sx={{
              backgroundColor: '#7b1fa2',
              color: '#ffffff',
              fontWeight: 'bold',
              py: 1.5,
              boxShadow: '0 3px 15px 2px rgba(123, 31, 162, .3)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                backgroundColor: '#4a148c',
              },
            }}
          >
            {buttonText}
          </Button>
        </Box>
      </Box>
    </>
  );
}
