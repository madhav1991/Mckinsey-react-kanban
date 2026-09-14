import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it, vi } from 'vitest';
import { KanbanCard, KanbanCardOverlay } from './KanbanCard';
import { KanbanItem } from '../types/kanban';

// Mock dnd-kit hooks
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => '',
    },
  },
}));

describe('KanbanCard Component', () => {
  const sampleItem: KanbanItem = {
    id: 'item-100',
    title: 'Assemble portal gun',
    character: {
      id: '1',
      name: 'Rick Sanchez',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    },
    columnId: 'todo',
    createdAt: Date.now(),
  };

  const renderWithMantine = (ui: React.ReactElement) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
  };

  it('renders task title and character name', () => {
    renderWithMantine(<KanbanCard item={sampleItem} />);

    expect(screen.getByText('Assemble portal gun')).toBeInTheDocument();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('renders KanbanCardOverlay correctly during drag', () => {
    renderWithMantine(<KanbanCardOverlay item={sampleItem} />);

    expect(screen.getByText('Assemble portal gun')).toBeInTheDocument();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });
});
