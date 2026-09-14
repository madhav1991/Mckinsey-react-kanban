export type ColumnId = 'todo' | 'doing' | 'done';

export interface Character {
  id: string;
  name: string;
  image: string;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export interface KanbanItem {
  id: string;
  title: string;
  character: Character;
  columnId: ColumnId;
  createdAt: number;
}

export interface BoardState {
  items: KanbanItem[];
}

export type BoardAction =
  | { type: 'ADD_ITEM'; payload: { title: string; character: Character; columnId?: ColumnId } }
  | { type: 'REORDER_ITEM'; payload: { activeId: string; overId: string } };
