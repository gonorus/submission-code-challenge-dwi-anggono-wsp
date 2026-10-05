import { useState, useMemo, FormEvent } from 'react';
import { Card, CardContent, Box, CircularProgress } from '@mui/material';
import { usePrices } from '@api/prices';

import SwapForm from './SwapForm';
import SwapProgress from './SwapProgress';
import SwapSuccess from './SwapSuccess';

const NO_TOKENS: Record<string, number> = {};

type SwapStatus = 'idle' | 'swapping' | 'success';

export default function SwapCard() {
  const { data, isLoading: loadingPrices } = usePrices();
  const tokens = data ?? NO_TOKENS;

  const [fromChoice, setFromCurrency] = useState<string>('');
  const [toChoice, setToCurrency] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');

  const [status, setStatus] = useState<SwapStatus>('idle');

  // Used for displaying in the success screen after form is reset
  const [lastSwap, setLastSwap] = useState({
    pay: '',
    receive: '',
    payToken: '',
    receiveToken: '',
  });

  const availableTokens = useMemo(() => Object.keys(tokens).sort(), [tokens]);

  // Until the user picks a token, default to the first two available ones.
  const fromCurrency = fromChoice || (availableTokens.length >= 2 ? availableTokens[0] : '');
  const toCurrency = toChoice || (availableTokens.length >= 2 ? availableTokens[1] : '');
  const availableForPay = useMemo(
    () => availableTokens.filter((t) => t !== toCurrency),
    [availableTokens, toCurrency],
  );
  const availableForReceive = useMemo(
    () => availableTokens.filter((t) => t !== fromCurrency),
    [availableTokens, fromCurrency],
  );

  const fromPrice = tokens[fromCurrency] || 0;
  const toPrice = tokens[toCurrency] || 0;

  const outputAmount = useMemo(() => {
    if (!amount || isNaN(Number(amount))) return '';
    if (Number(amount) === 0) return '0.000000';
    if (fromPrice && toPrice) {
      return ((parseFloat(amount) * fromPrice) / toPrice).toFixed(6);
    }
    return '0.000000';
  }, [amount, fromPrice, toPrice]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConfirmSwap = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLastSwap({
      pay: amount,
      receive: outputAmount,
      payToken: fromCurrency,
      receiveToken: toCurrency,
    });
    setStatus('swapping');

    setTimeout(() => {
      setStatus('success');
      setAmount('0');
    }, 2000);
  };

  const handleDone = () => {
    setStatus('idle');
  };

  const isFormValid =
    Number(amount) > 0 &&
    Boolean(fromCurrency) &&
    Boolean(toCurrency) &&
    fromCurrency !== toCurrency;

  const buttonText = isFormValid ? 'Swap' : 'Enter an amount';

  return (
    <Card
      sx={{
        maxWidth: status === 'idle' ? 480 : 400,
        width: '100%',
        mx: 'auto',
        mt: 8,
        p: status === 'idle' ? 2 : 3,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          position: 'relative',
          justifyContent: 'center',
        }}
      >
        {loadingPrices ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}
          >
            <CircularProgress />
          </Box>
        ) : status === 'idle' ? (
          <SwapForm
            amount={amount}
            onAmountChange={setAmount}
            outputAmount={outputAmount}
            fromCurrency={fromCurrency}
            onFromCurrencyChange={setFromCurrency}
            availableForPay={availableForPay}
            toCurrency={toCurrency}
            onToCurrencyChange={setToCurrency}
            availableForReceive={availableForReceive}
            onSwapCurrencies={handleSwapCurrencies}
            onSubmit={handleConfirmSwap}
            isFormValid={isFormValid}
            buttonText={buttonText}
          />
        ) : status === 'swapping' ? (
          <SwapProgress
            payAmount={lastSwap.pay}
            payToken={lastSwap.payToken}
            receiveAmount={lastSwap.receive}
            receiveToken={lastSwap.receiveToken}
          />
        ) : (
          <SwapSuccess onConfirm={handleDone} />
        )}
      </CardContent>
    </Card>
  );
}
