import { describe, expect, it } from 'vitest';
import { boardReducer, initialBoardState } from './boardReducer';
import { BoardState } from '../types/kanban';

describe('boardReducer', () => {
  it('should handle ADD_ITEM action', () => {
    const action = {
      type: 'ADD_ITEM' as const,
      payload: {
        title: 'New test task',
        character: { id: '10', name: 'Alan Rails', image: 'https://example.com/10.jpeg' },
        columnId: 'todo' as const,
      },
    };

    const newState = boardReducer(initialBoardState, action);

    expect(newState.items.length).toBe(initialBoardState.items.length + 1);
    expect(newState.items[0].title).toBe('New test task');
    expect(newState.items[0].character.name).toBe('Alan Rails');
    expect(newState.items[0].columnId).toBe('todo');
  });

  it('should handle REORDER_ITEM within the same column', () => {
    const state: BoardState = {
      items: [
        {
          id: 'item-1',
          title: 'Task 1',
          character: { id: '1', name: 'Rick', image: '' },
          columnId: 'todo',
          createdAt: 100,
        },
        {
          id: 'item-2',
          title: 'Task 2',
          character: { id: '2', name: 'Morty', image: '' },
          columnId: 'todo',
          createdAt: 200,
        },
      ],
    };

    const action = {
      type: 'REORDER_ITEM' as const,
      payload: { activeId: 'item-1', overId: 'item-2' },
    };

    const newState = boardReducer(state, action);

    expect(newState.items[0].id).toBe('item-2');
    expect(newState.items[1].id).toBe('item-1');
  });

  it('should handle REORDER_ITEM across columns (over another item)', () => {
    const state: BoardState = {
      items: [
        {
          id: 'item-1',
          title: 'Task 1',
          character: { id: '1', name: 'Rick', image: '' },
          columnId: 'todo',
          createdAt: 100,
        },
        {
          id: 'item-2',
          title: 'Task 2',
          character: { id: '2', name: 'Morty', image: '' },
          columnId: 'doing',
          createdAt: 200,
        },
      ],
    };

    const action = {
      type: 'REORDER_ITEM' as const,
      payload: { activeId: 'item-1', overId: 'item-2' },
    };

    const newState = boardReducer(state, action);

    const reorderedItem = newState.items.find((i) => i.id === 'item-1');
    expect(reorderedItem?.columnId).toBe('doing');
  });

  it('should handle REORDER_ITEM onto a column container directly', () => {
    const state: BoardState = {
      items: [
        {
          id: 'item-1',
          title: 'Task 1',
          character: { id: '1', name: 'Rick', image: '' },
          columnId: 'todo',
          createdAt: 100,
        },
      ],
    };

    const action = {
      type: 'REORDER_ITEM' as const,
      payload: { activeId: 'item-1', overId: 'done' },
    };

    const newState = boardReducer(state, action);

    expect(newState.items[0].columnId).toBe('done');
  });
});
