import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it, vi } from 'vitest';
import { ItemCreationForm } from './ItemCreationForm';
import * as api from '../services/rickAndMortyApi';

describe('ItemCreationForm Component', () => {
  const renderWithMantine = (ui: React.ReactElement) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
  };

  it('renders form inputs and submit button', () => {
    renderWithMantine(<ItemCreationForm onAddItem={vi.fn()} />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task title (e.g., Fix portal gun)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type character name (e.g. Rick, Morty)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
  });

  it('displays error when submitting without selecting a character', async () => {
    const { container } = renderWithMantine(<ItemCreationForm onAddItem={vi.fn()} />);

    const titleInput = screen.getByPlaceholderText('Task title (e.g., Fix portal gun)');
    fireEvent.change(titleInput, { target: { value: 'Fix microverse' } });

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(
      screen.getByText('Please select a Rick and Morty character from the dropdown')
    ).toBeInTheDocument();
  });

  it('fetches character search results when typing character name', async () => {
    const mockChar = { id: '1', name: 'Rick Sanchez', image: 'https://example.com/1.jpeg' };
    vi.spyOn(api, 'searchCharacters').mockResolvedValueOnce([mockChar]);

    renderWithMantine(<ItemCreationForm onAddItem={vi.fn()} />);

    const charInput = screen.getByPlaceholderText('Type character name (e.g. Rick, Morty)');
    fireEvent.change(charInput, { target: { value: 'Rick' } });

    await waitFor(() => {
      expect(api.searchCharacters).toHaveBeenCalledWith('Rick');
    });
  });
});
