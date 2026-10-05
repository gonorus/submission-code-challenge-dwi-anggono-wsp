import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageLayout } from './PageLayout';

describe('PageLayout Component', () => {
  it('renders children correctly and passes attributes', () => {
    render(
      <PageLayout data-testid="page-layout" className="layout-class">
        <span>Child Content</span>
      </PageLayout>,
    );

    const layout = screen.getByTestId('page-layout');
    expect(layout).toHaveClass('layout-class');
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
