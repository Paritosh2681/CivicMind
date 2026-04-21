// Mock modules before importing
jest.mock('@/lib/tavily', () => ({
  searchWeb: jest.fn(),
}));

jest.mock('@/lib/gemini', () => ({
  model: {
    startChat: jest.fn(),
  },
}));

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    constructor(url: string, init?: any) {
      this.url = url;
      this.body = init?.body;
    }
    async json() {
      try {
        return typeof this.body === 'string' 
          ? JSON.parse(this.body) 
          : this.body;
      } catch {
        return {};
      }
    }
  },
  NextResponse: {
    json: (data: any, options?: any) => ({
      status: options?.status || 200,
      json: async () => data,
    }),
  },
}));

import { POST } from '@/app/api/chat/route';
import { NextRequest } from 'next/server';
import * as tavily from '@/lib/tavily';
import * as gemini from '@/lib/gemini';
import * as supabaseServer from '@/lib/supabase/server';

describe('/api/chat Route', () => {
  let mockSearchWeb: jest.Mock;
  let mockStartChat: jest.Mock;
  let mockCreateClient: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchWeb = tavily.searchWeb as jest.Mock;
    mockStartChat = gemini.model.startChat as jest.Mock;
    mockCreateClient = supabaseServer.createClient as jest.Mock;

    // Setup default mocks
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
        }),
      },
      from: jest.fn().mockReturnValue({
        insert: jest.fn(),
      }),
    });

    mockSearchWeb.mockResolvedValue([]);

    const mockStream = {
      [Symbol.asyncIterator]: async function* () {
        yield { text: () => 'Test response' };
      },
    };

    mockStartChat.mockReturnValue({
      sendMessageStream: jest.fn().mockResolvedValue({
        stream: mockStream,
      }),
    });
  });

  it('returns 401 if user is not authenticated', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      },
    });

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test' }],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('returns 400 error if no messages are provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [] }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns 400 error if messages body is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('calls Tavily search with the user message', async () => {
    const mockUser = { id: 'user-123' };
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
      from: jest.fn().mockReturnValue({
        insert: jest.fn(),
      }),
    });

    mockSearchWeb.mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'How do I register to vote?' },
        ],
        chatId: 'chat-123',
      }),
    });

    await POST(request);

    expect(mockSearchWeb).toHaveBeenCalledWith('How do I register to vote?', 3);
  });

  it('handles edge case: empty chat history', async () => {
    const mockUser = { id: 'user-123' };
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
      from: jest.fn().mockReturnValue({
        insert: jest.fn(),
      }),
    });

    mockSearchWeb.mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test question' }],
        chatId: null,
      }),
    });

    const response = await POST(request);

    expect(response.status).not.toBe(400);
  });

  it('handles edge case: very long message over 1000 characters', async () => {
    const mockUser = { id: 'user-123' };
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
      from: jest.fn().mockReturnValue({
        insert: jest.fn(),
      }),
    });

    mockSearchWeb.mockResolvedValue([]);

    const longMessage = 'a'.repeat(2000);

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: longMessage }],
        chatId: 'chat-123',
      }),
    });

    const response = await POST(request);

    expect(response.status).not.toBe(400);
    expect(mockSearchWeb).toHaveBeenCalledWith(longMessage, 3);
  });

  it('rejects request if last message is not from user', async () => {
    const mockUser = { id: 'user-123' };
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
    });

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'assistant', content: 'Test' }],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
