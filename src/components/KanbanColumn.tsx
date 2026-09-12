import React from 'react';
import { Badge, Box, Group, Paper, Text } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column, KanbanItem } from '../types/kanban';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  column: Column;
  items: KanbanItem[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, items }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const getBadgeColor = (id: string) => {
    switch (id) {
      case 'todo':
        return 'blue';
      case 'doing':
        return 'yellow';
      case 'done':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Paper
      ref={setNodeRef}
      withBorder
      p="md"
      radius="md"
      bg={isOver ? 'var(--mantine-color-blue-light)' : 'var(--mantine-color-gray-0)'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '400px',
        transition: 'background-color 0.2s ease',
      }}
    >
      <Group justify="space-between" mb="md">
        <Text fw={700} size="md">
          {column.title}
        </Text>
        <Badge color={getBadgeColor(column.id)} variant="light" radius="sm">
          {items.length}
        </Badge>
      </Group>

      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ flex: 1 }}>
          {items.map((item) => (
            <KanbanCard key={item.id} item={item} />
          ))}

          {items.length === 0 && (
            <Box
              p="xl"
              style={{
                border: '2px dashed var(--mantine-color-gray-3)',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <Text size="xs" c="dimmed">
                Drop items here
              </Text>
            </Box>
          )}
        </Box>
      </SortableContext>
    </Paper>
  );
};
