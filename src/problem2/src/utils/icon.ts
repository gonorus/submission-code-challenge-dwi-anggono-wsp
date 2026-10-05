const ICON_BASE_URL = import.meta.env.VITE_ICON_BASE_URL as string;

/**
 * The prices API upper-cases some symbols whose icon files in the
 * Switcheo/token-icons repository use a lowercase prefix (liquid-staking tokens).
 */
const ICON_FILE_OVERRIDES: Record<string, string> = {
  STATOM: 'stATOM',
  STOSMO: 'stOSMO',
  STLUNA: 'stLUNA',
  STEVMOS: 'stEVMOS',
  RATOM: 'rATOM',
};

export const getIconUrl = (symbol: string) =>
  `${ICON_BASE_URL}/${ICON_FILE_OVERRIDES[symbol.toUpperCase()] ?? symbol}.svg`;
