import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';
import { ColorModeContext } from '@contexts/ColorModeContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

describe('Header', () => {
  it('renders logo and theme toggle', () => {
    const toggleColorMode = vi.fn();
    const lightTheme = createTheme({ palette: { mode: 'light' } });

    render(
      <ColorModeContext.Provider value={{ toggleColorMode }}>
        <ThemeProvider theme={lightTheme}>
          <Header />
        </ThemeProvider>
      </ColorModeContext.Provider>,
    );

    // Should render Swap text
    expect(screen.getByText('Swap')).toBeInTheDocument();

    // Should render the App Icon image
    expect(screen.getByAltText('App Icon')).toBeInTheDocument();

    // Theme toggle button should be present
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument();
  });
});
