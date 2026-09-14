import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it, vi } from 'vitest';
import { KanbanColumn } from './KanbanColumn';
import { Column, KanbanItem } from '../types/kanban';

// Mock dnd-kit core and sortable hooks
vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  verticalListSortingStrategy: {},
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

describe('KanbanColumn Component', () => {
  const sampleColumn: Column = {
    id: 'todo',
    title: 'To Do',
  };

  const sampleItems: KanbanItem[] = [
    {
      id: 'item-1',
      title: 'Fix ship engine',
      character: { id: '1', name: 'Rick Sanchez', image: '' },
      columnId: 'todo',
      createdAt: Date.now(),
    },
  ];

  const renderWithMantine = (ui: React.ReactElement) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
  };

  it('renders column title and badge count', () => {
    renderWithMantine(<KanbanColumn column={sampleColumn} items={sampleItems} />);

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Fix ship engine')).toBeInTheDocument();
  });

  it('renders empty drop area text when there are no items', () => {
    renderWithMantine(<KanbanColumn column={sampleColumn} items={[]} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Drop items here')).toBeInTheDocument();
  });
});
