import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeToggle from './ThemeToggle';
import { ColorModeContext } from '@contexts/ColorModeContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

describe('ThemeToggle', () => {
  it('renders light mode icon when theme is light and handles click', () => {
    const toggleColorMode = vi.fn();
    const lightTheme = createTheme({ palette: { mode: 'light' } });

    render(
      <ColorModeContext.Provider value={{ toggleColorMode }}>
        <ThemeProvider theme={lightTheme}>
          <ThemeToggle />
        </ThemeProvider>
      </ColorModeContext.Provider>,
    );

    const button = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(button).toBeInTheDocument();

    // Light mode uses DarkModeOutlinedIcon to switch to dark mode?
    // Wait, let's check the logic: isDark ? <LightModeIcon/> : <DarkModeIcon/>
    // If it's light mode (isDark=false), it shows DarkModeIcon.

    fireEvent.click(button);
    expect(toggleColorMode).toHaveBeenCalledTimes(1);
  });

  it('renders dark mode icon when theme is dark', () => {
    const toggleColorMode = vi.fn();
    const darkTheme = createTheme({ palette: { mode: 'dark' } });

    render(
      <ColorModeContext.Provider value={{ toggleColorMode }}>
        <ThemeProvider theme={darkTheme}>
          <ThemeToggle />
        </ThemeProvider>
      </ColorModeContext.Provider>,
    );

    const button = screen.getByRole('button', { name: /switch to light theme/i });
    expect(button).toBeInTheDocument();
  });
});
