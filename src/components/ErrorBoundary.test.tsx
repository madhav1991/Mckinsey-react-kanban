import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test crash in component');
};

describe('ErrorBoundary Component', () => {
  it('renders children when no error occurs', () => {
    render(
      <MantineProvider>
        <ErrorBoundary>
          <div>Safe Component</div>
        </ErrorBoundary>
      </MantineProvider>
    );

    expect(screen.getByText('Safe Component')).toBeInTheDocument();
  });

  it('renders fallback UI when a child component throws an error', () => {
    // Suppress console.error during expected throw test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MantineProvider>
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>
      </MantineProvider>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test crash in component')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
