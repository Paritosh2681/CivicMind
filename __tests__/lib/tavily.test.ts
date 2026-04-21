// Set up all mocks before importing the module being tested
const mockSearch = jest.fn();

jest.mock('@tavily/core', () => ({
  tavily: jest.fn(() => ({
    search: mockSearch,
  })),
}));

import { searchWeb } from '@/lib/tavily';

describe('Tavily Search Library', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearch.mockClear();
  });

  it('returns formatted context string from search results', async () => {
    const mockResults = [
      {
        title: 'Voter Registration Guide',
        content: 'You can register to vote online or in person',
        url: 'https://example.com/voter-registration',
      },
      {
        title: 'Voting Rights',
        content: 'All citizens have the right to vote',
        url: 'https://example.com/voting-rights',
      },
    ];

    mockSearch.mockResolvedValue({ results: mockResults });

    const result = await searchWeb('How do I register to vote?');

    expect(result).toEqual([
      {
        title: 'Voter Registration Guide',
        content: 'You can register to vote online or in person',
        url: 'https://example.com/voter-registration',
      },
      {
        title: 'Voting Rights',
        content: 'All citizens have the right to vote',
        url: 'https://example.com/voting-rights',
      },
    ]);
  });

  it('handles empty results gracefully without crashing', async () => {
    mockSearch.mockResolvedValue({ results: [] });

    const result = await searchWeb('Some query');

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('handles API errors gracefully and returns empty array', async () => {
    mockSearch.mockRejectedValue(new Error('API Error'));

    const result = await searchWeb('Some query');

    expect(result).toEqual([]);
  });

  it('calls search with correct parameters', async () => {
    mockSearch.mockResolvedValue({ results: [] });

    await searchWeb('Test query', 5);

    expect(mockSearch).toHaveBeenCalledWith('Test query', {
      searchDepth: 'basic',
      includeAnswer: false,
      maxResults: 5,
    });
  });

  it('uses default maxResults of 3', async () => {
    mockSearch.mockResolvedValue({ results: [] });

    await searchWeb('Test query');

    expect(mockSearch).toHaveBeenCalledWith('Test query', {
      searchDepth: 'basic',
      includeAnswer: false,
      maxResults: 3,
    });
  });

  it('maps result fields correctly', async () => {
    const mockResults = [
      {
        title: 'Test Title',
        content: 'Test Content',
        url: 'https://test.com',
        extra_field: 'should not be included',
      },
    ];

    mockSearch.mockResolvedValue({ results: mockResults });

    const result = await searchWeb('query');

    expect(result[0]).toHaveProperty('title', 'Test Title');
    expect(result[0]).toHaveProperty('content', 'Test Content');
    expect(result[0]).toHaveProperty('url', 'https://test.com');
    expect(result[0]).not.toHaveProperty('extra_field');
  });

  it('handles network errors gracefully', async () => {
    const networkError = new Error('Network Error');
    mockSearch.mockRejectedValue(networkError);

    const result = await searchWeb('query');

    expect(result).toEqual([]);
  });

  it('handles timeout errors gracefully', async () => {
    const timeoutError = new Error('Request Timeout');
    mockSearch.mockRejectedValue(timeoutError);

    const result = await searchWeb('query');

    expect(result).toEqual([]);
  });
});
