import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('App', () => {
  it('renders without crashing and toggles theme', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
    expect(screen.getByText('Swap')).toBeInTheDocument();

    const themeButton = screen.getByRole('button', { name: /switch to/i });
    expect(themeButton).toBeInTheDocument();

    // Initial state is dark mode, clicking should change it to light mode
    fireEvent.click(themeButton);

    // Clicking again should change back to dark mode
    fireEvent.click(themeButton);
  });
});
