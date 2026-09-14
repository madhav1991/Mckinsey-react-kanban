import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchCharacters } from './rickAndMortyApi';

describe('rickAndMortyApi service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return empty array when query is empty or whitespace', async () => {
    const results = await searchCharacters('   ');
    expect(results).toEqual([]);
  });

  it('should fetch and return character list on valid response', async () => {
    const mockCharacters = [
      { id: '1', name: 'Rick Sanchez', image: 'https://example.com/1.jpeg' },
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          characters: {
            results: mockCharacters,
          },
        },
      }),
    } as Response);

    const results = await searchCharacters('Rick');
    expect(results).toEqual(mockCharacters);
  });

  it('should return empty array when GraphQL returns errors (e.g. 404 / no match)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        errors: [{ message: '404: Nothing Here' }],
      }),
    } as Response);

    const results = await searchCharacters('NonExistentCharacter');
    expect(results).toEqual([]);
  });
});
