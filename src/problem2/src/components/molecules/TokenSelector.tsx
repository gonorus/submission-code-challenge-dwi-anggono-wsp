import { SyntheticEvent, memo } from 'react';
import { Autocomplete, Box, InputAdornment, TextField, Typography } from '@mui/material';
import TokenIcon from '@atoms/TokenIcon';

export interface TokenSelectorProps {
  label?: string;
  value: string;
  availableTokens: string[];
  onChange?: (token: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

const TokenSelector = memo(function TokenSelector({
  label = 'Token',
  value,
  availableTokens,
  onChange,
  disabled = false,
  readOnly = false,
}: TokenSelectorProps) {
  const handleChange = (_: SyntheticEvent, token: string | null) => {
    if (token && onChange) onChange(token);
  };

  const inputId = `${label.replace(/\s+/g, '-')}-select`;

  return (
    <Autocomplete
      id={inputId}
      sx={{ minWidth: 160 }}
      options={availableTokens}
      // Cast: MUI types disableClearable values as non-null, but null is valid at runtime (no selection).
      value={(value || null) as unknown as string}
      onChange={handleChange}
      disableClearable
      autoHighlight
      disabled={disabled || availableTokens.length === 0}
      readOnly={readOnly}
      noOptionsText="No tokens found"
      isOptionEqualToValue={(option, selected) => option === selected}
      renderOption={(props, option) => {
        const { key, ...rest } = props as typeof props & { key: string };
        return (
          <Box
            component="li"
            key={key}
            {...rest}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <TokenIcon symbol={option} size={20} />
            <Typography component="span">{option}</Typography>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: value ? (
                <InputAdornment position="start">
                  <TokenIcon symbol={value} size={20} />
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
      )}
    />
  );
});

export default TokenSelector;
