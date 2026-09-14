import React, { useReducer, useState } from 'react';
import { SimpleGrid } from '@mantine/core';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import confetti from 'canvas-confetti';

import { boardReducer, COLUMNS, initialBoardState } from '../state/boardReducer';
import { Character, ColumnId, KanbanItem } from '../types/kanban';
import { ItemCreationForm } from './ItemCreationForm';
import { KanbanCardOverlay } from './KanbanCard';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard: React.FC = () => {
  const [state, dispatch] = useReducer(boardReducer, initialBoardState);
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddItem = (title: string, character: Character) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { title, character, columnId: 'todo' },
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = state.items.find((i) => i.id === active.id);
    if (item) {
      setActiveItem(item);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const draggedItem = state.items.find((i) => i.id === activeId);
    if (!draggedItem) return;

    const sourceColumnId = draggedItem.columnId;

    // Determine target column ID
    let targetColumnId: ColumnId | null = null;

    if (COLUMNS.some((col) => col.id === overId)) {
      targetColumnId = overId as ColumnId;
    } else {
      const overItem = state.items.find((i) => i.id === overId);
      if (overItem) {
        targetColumnId = overItem.columnId;
      }
    }

    // Trigger completion confetti when moving item into 'done' column from another column
    if (targetColumnId === 'done' && sourceColumnId !== 'done') {
      triggerConfetti();
    }

    dispatch({
      type: 'REORDER_ITEM',
      payload: { activeId, overId },
    });
  };

  // Screen reader announcements for keyboard drag-and-drop
  const accessibilityAnnouncements = {
    onDragStart({ active }: { active: { id: string | number } }) {
      const item = state.items.find((i) => i.id === active.id);
      const colName = COLUMNS.find((c) => c.id === item?.columnId)?.title || '';
      return `Picked up task "${item?.title || active.id}" from ${colName} column.`;
    },
    onDragOver({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) {
      if (!over) return undefined;
      const item = state.items.find((i) => i.id === active.id);
      const overColumn = COLUMNS.find((c) => c.id === over.id);
      if (overColumn) {
        return `Task "${item?.title}" is over ${overColumn.title} column.`;
      }
      const overItem = state.items.find((i) => i.id === over.id);
      return `Task "${item?.title}" is over task "${overItem?.title}".`;
    },
    onDragEnd({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) {
      if (!over) return `Task drag cancelled.`;
      const item = state.items.find((i) => i.id === active.id);
      const overColumn = COLUMNS.find((c) => c.id === over.id);
      const targetCol = overColumn ? overColumn.title : COLUMNS.find((c) => c.id === state.items.find((i) => i.id === over.id)?.columnId)?.title;
      return `Dropped task "${item?.title}" in ${targetCol || 'column'}.`;
    },
    onDragCancel({ active }: { active: { id: string | number } }) {
      const item = state.items.find((i) => i.id === active.id);
      return `Moving task "${item?.title}" was cancelled.`;
    },
  };

  return (
    <>
      <ItemCreationForm onAddItem={handleAddItem} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        accessibility={{ announcements: accessibilityAnnouncements }}
      >
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {COLUMNS.map((column) => {
            const columnItems = state.items.filter((item) => item.columnId === column.id);
            return <KanbanColumn key={column.id} column={column} items={columnItems} />;
          })}
        </SimpleGrid>

        <DragOverlay>
          {activeItem ? <KanbanCardOverlay item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};
