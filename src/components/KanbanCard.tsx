import React from 'react';
import { Avatar, Box, Card, Group, Text } from '@mantine/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanItem } from '../types/kanban';

interface KanbanCardProps {
  item: KanbanItem;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { item },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: 'grab',
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      withBorder
      shadow="xs"
      p="sm"
      radius="md"
      mb="sm"
      bg="var(--mantine-color-body)"
    >
      <Box {...attributes} {...listeners}>
        <Text fw={500} size="sm" mb="xs" style={{ wordBreak: 'break-word' }}>
          {item.title}
        </Text>

        <Group gap="xs" align="center">
          <Avatar
            src={item.character.image}
            alt={item.character.name}
            size="sm"
            radius="xl"
          />
          <Text size="xs" c="dimmed" fw={500}>
            {item.character.name}
          </Text>
        </Group>
      </Box>
    </Card>
  );
};

export const KanbanCardOverlay: React.FC<{ item: KanbanItem }> = ({ item }) => {
  return (
    <Card
      withBorder
      shadow="md"
      p="sm"
      radius="md"
      bg="var(--mantine-color-body)"
      style={{ cursor: 'grabbing', opacity: 0.9 }}
    >
      <Box>
        <Text fw={500} size="sm" mb="xs" style={{ wordBreak: 'break-word' }}>
          {item.title}
        </Text>

        <Group gap="xs" align="center">
          <Avatar
            src={item.character.image}
            alt={item.character.name}
            size="sm"
            radius="xl"
          />
          <Text size="xs" c="dimmed" fw={500}>
            {item.character.name}
          </Text>
        </Group>
      </Box>
    </Card>
  );
};
