import { Container, MantineProvider, Title } from '@mantine/core';
import '@mantine/core/styles.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { KanbanBoard } from './components/KanbanBoard';

export default function App() {
  return (
    <MantineProvider>
      <Container size="xl" py="md">
        <header>
          <Title order={1} ta="center" mb="lg" c="blue.7" style={{ fontSize: '2rem' }}>
            Rick and Morty Kanban Board
          </Title>
        </header>
        <main aria-label="Rick and Morty Kanban Board">
          <ErrorBoundary>
            <KanbanBoard />
          </ErrorBoundary>
        </main>
      </Container>
    </MantineProvider>
  );
}
