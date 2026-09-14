import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Container, Stack, Text } from '@mantine/core';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container size="sm" py="xl">
          <Alert color="red" title="Something went wrong" radius="md">
            <Stack gap="sm">
              <Text size="sm">
                An unexpected error occurred while rendering the Kanban board.
              </Text>
              {this.state.error && (
                <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                  {this.state.error.message}
                </Text>
              )}
              <Button size="xs" color="red" variant="light" onClick={this.handleReset} style={{ alignSelf: 'flex-start' }}>
                Try Again
              </Button>
            </Stack>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}
