import { BoardAction, BoardState, Column, KanbanItem } from '../types/kanban';

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
];

export const initialBoardState: BoardState = {
  items: [
    {
      id: 'item-1',
      title: 'Fix portal gun calibration',
      character: {
        id: '1',
        name: 'Rick Sanchez',
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      },
      columnId: 'todo',
      createdAt: Date.now() - 300000,
    },
    {
      id: 'item-2',
      title: 'Help Morty with science project',
      character: {
        id: '2',
        name: 'Morty Smith',
        image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
      },
      columnId: 'doing',
      createdAt: Date.now() - 200000,
    },
    {
      id: 'item-3',
      title: 'Defeat the Gromflomites',
      character: {
        id: '3',
        name: 'Summer Smith',
        image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
      },
      columnId: 'done',
      createdAt: Date.now() - 100000,
    },
  ],
};

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem: KanbanItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: action.payload.title,
        character: action.payload.character,
        columnId: action.payload.columnId || 'todo',
        createdAt: Date.now(),
      };
      return {
        ...state,
        items: [newItem, ...state.items],
      };
    }

    case 'MOVE_ITEM': {
      const { itemId, targetColumnId } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, columnId: targetColumnId } : item
        ),
      };
    }

    case 'REORDER_ITEM': {
      const { activeId, overId } = action.payload;
      if (activeId === overId) return state;

      const activeIndex = state.items.findIndex((item) => item.id === activeId);
      if (activeIndex === -1) return state;

      const activeItem = state.items[activeIndex];

      // Check if overId is a column ID directly (dropping onto an empty column container)
      const isOverColumn = COLUMNS.some((col) => col.id === overId);

      if (isOverColumn) {
        const targetColumnId = overId as KanbanItem['columnId'];
        if (activeItem.columnId === targetColumnId) return state;

        const updatedItems = [...state.items];
        updatedItems[activeIndex] = { ...activeItem, columnId: targetColumnId };
        return { ...state, items: updatedItems };
      }

      // overId is another item ID
      const overIndex = state.items.findIndex((item) => item.id === overId);
      if (overIndex === -1) return state;

      const overItem = state.items[overIndex];
      const targetColumnId = overItem.columnId;

      const updatedItems = [...state.items];
      // Update columnId if moving across columns
      const updatedActiveItem = { ...activeItem, columnId: targetColumnId };

      // Remove from old index
      updatedItems.splice(activeIndex, 1);
      // Insert at new index
      updatedItems.splice(overIndex, 0, updatedActiveItem);

      return {
        ...state,
        items: updatedItems,
      };
    }

    default:
      return state;
  }
}
