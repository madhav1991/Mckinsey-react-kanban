import { Container, MantineProvider, Title } from '@mantine/core';
import '@mantine/core/styles.css';
import { KanbanBoard } from './components/KanbanBoard';

export default function App() {
  return (
    <MantineProvider>
      <Container size="xl" py="md">
        <Title order={2} ta="center" mb="lg" c="blue.7">
          Rick and Morty Kanban Board
        </Title>
        <KanbanBoard />
      </Container>
    </MantineProvider>
  );
}
