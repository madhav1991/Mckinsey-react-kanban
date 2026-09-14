import React, { useReducer, useState } from 'react';
import { Container, SimpleGrid } from '@mantine/core';
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

  return (
    <Container size="xl" py="lg">
      <ItemCreationForm onAddItem={handleAddItem} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
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
    </Container>
  );
};
