import { Character } from '../types/kanban';

const GRAPHQL_ENDPOINT = 'https://rickandmortyapi.com/graphql';

const GET_CHARACTERS_QUERY = `
  query SearchCharacters($name: String!) {
    characters(filter: { name: $name }) {
      results {
        id
        name
        image
      }
    }
  }
`;

export async function searchCharacters(name: string): Promise<Character[]> {
  if (!name.trim()) {
    return [];
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_CHARACTERS_QUERY,
        variables: { name: name.trim() },
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      // GraphQL API returns errors (e.g. 404 Not Found) when no characters match
      return [];
    }

    return data?.data?.characters?.results || [];
  } catch (error) {
    console.error('Failed to fetch Rick and Morty characters:', error);
    return [];
  }
}
