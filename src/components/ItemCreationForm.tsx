import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Avatar,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { searchCharacters } from '../services/rickAndMortyApi';
import { Character } from '../types/kanban';

interface ItemCreationFormProps {
  onAddItem: (title: string, character: Character) => void;
}

export const ItemCreationForm: React.FC<ItemCreationFormProps> = ({ onAddItem }) => {
  const [title, setTitle] = useState('');
  const [characterQuery, setCharacterQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(characterQuery, 300);

  const [loading, setLoading] = useState(false);
  const [characterResults, setCharacterResults] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [error, setError] = useState('');

  // Fetch characters when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setCharacterResults([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    searchCharacters(debouncedQuery)
      .then((results) => {
        if (isMounted) {
          setCharacterResults(results);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCharacterResults([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Construct dropdown options using unique character ID as option value
  const getDropdownData = () => {
    if (loading) {
      return [{ value: '__loading__', label: 'Searching characters...', disabled: true }];
    }
    if (debouncedQuery.trim() !== '' && characterResults.length === 0) {
      return [{ value: '__empty__', label: 'No characters found', disabled: true }];
    }
    return characterResults.map((char) => ({
      value: char.id, // unique ID guarantees Mantine option uniqueness
      label: char.name, // display text
      image: char.image,
    }));
  };

  const handleOptionSubmit = (val: string) => {
    if (val === '__loading__' || val === '__empty__') return;
    const foundChar = characterResults.find((c) => c.id === val);
    if (foundChar) {
      setSelectedCharacter(foundChar);
      setCharacterQuery(foundChar.name);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    // selectedCharacter is the single source of truth
    if (!selectedCharacter) {
      setError('Please select a Rick and Morty character from the dropdown');
      return;
    }

    onAddItem(title.trim(), selectedCharacter);

    // Reset form
    setTitle('');
    setCharacterQuery('');
    setSelectedCharacter(null);
    setCharacterResults([]);
    setError('');
  };

  return (
    <Card component="section" aria-label="Create new task" withBorder shadow="sm" radius="md" p="md" mb="lg">
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <Text fw={600} size="md">
            Create New Task
          </Text>

          <Group align="flex-start" grow wrap="wrap">
            <TextInput
              placeholder="Task title (e.g., Fix portal gun)"
              label="Title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.currentTarget.value);
                if (error) setError('');
              }}
            />

            <Autocomplete
              label="Assign Character"
              placeholder="Type character name (e.g. Rick, Morty)"
              required
              value={characterQuery}
              onChange={(val) => {
                setCharacterQuery(val);
                if (selectedCharacter && selectedCharacter.name !== val && selectedCharacter.id !== val) {
                  setSelectedCharacter(null);
                }
                if (error) setError('');
              }}
              data={getDropdownData()}
              onOptionSubmit={handleOptionSubmit}
              rightSection={loading ? <Loader size="xs" /> : undefined}
              filter={({ options }) => options} // API handles filtering
              renderOption={({ option }) => {
                if (option.value === '__loading__') {
                  return (
                    <Group gap="xs">
                      <Loader size="xs" />
                      <Text size="sm" c="dimmed">
                        Searching characters...
                      </Text>
                    </Group>
                  );
                }
                if (option.value === '__empty__') {
                  return (
                    <Text size="sm" c="dimmed">
                      No characters found
                    </Text>
                  );
                }

                const charItem = characterResults.find((c) => c.id === option.value);

                return (
                  <Group gap="xs" wrap="nowrap">
                    {charItem && <Avatar src={charItem.image} alt={charItem.name} size="sm" radius="xl" />}
                    <Text size="sm">{charItem ? charItem.name : option.value}</Text>
                  </Group>
                );
              }}
            />
          </Group>

          {selectedCharacter && (
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                Selected character:
              </Text>
              <Avatar src={selectedCharacter.image} alt={selectedCharacter.name} size="xs" radius="xl" />
              <Text size="xs" fw={500}>
                {selectedCharacter.name}
              </Text>
            </Group>
          )}

          {error && (
            <Text c="red" size="xs" role="alert" aria-live="polite">
              {error}
            </Text>
          )}

          <Group justify="flex-end" mt="xs">
            <Button type="submit" size="sm">
              Add Task
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};
