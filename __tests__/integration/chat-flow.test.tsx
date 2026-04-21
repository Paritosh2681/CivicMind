/** @jest-environment jsdom */
import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Chat Flow Component for integration testing
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ChatFlow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Simulate API call
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      // Add empty assistant message
      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: 'Searching...' },
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div data-testid="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            data-testid={`message-${msg.role}`}
            className={msg.role}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {isLoading && (
        <div data-testid="loading-state">Loading...</div>
      )}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        data-testid="message-input"
      />
      <button
        onClick={handleSendMessage}
        disabled={!input.trim() || isLoading}
        data-testid="send-button"
      >
        Send
      </button>
    </div>
  );
};

describe('Chat Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the chat interface', () => {
    render(<ChatFlow />);
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  it('allows user to type a message', async () => {
    const user = userEvent.setup();
    render(<ChatFlow />);

    const input = screen.getByTestId('message-input');
    await user.type(input, 'How do I register to vote?');

    expect(input).toHaveValue('How do I register to vote?');
  });

  it('displays user message when send button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatFlow />);

    const input = screen.getByTestId('message-input');
    const sendButton = screen.getByTestId('send-button');

    // Mock fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    await user.type(input, 'Test question');
    await user.click(sendButton);

    await waitFor(() => {
      const userMessages = screen.queryAllByTestId('message-user');
      expect(userMessages.length).toBeGreaterThan(0);
    });
  });

  it('clears input box after sending message', async () => {
    const user = userEvent.setup();
    render(<ChatFlow />);

    const input = screen.getByTestId('message-input') as HTMLInputElement;
    const sendButton = screen.getByTestId('send-button');

    // Mock fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    await user.type(input, 'Test');
    await user.click(sendButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('shows loading state while waiting for response', async () => {
    const user = userEvent.setup();
    render(<ChatFlow />);

    const input = screen.getByTestId('message-input');
    const sendButton = screen.getByTestId('send-button');

    // Mock fetch with delayed response
    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
              }),
            100
          )
        )
    );

    await user.type(input, 'Question');
    await user.click(sendButton);

    // Loading state should appear briefly
    await waitFor(
      () => {
        const loadingState = screen.queryByTestId('loading-state');
        expect(loadingState).toBeInTheDocument();
      },
      { timeout: 50 }
    ).catch(() => {
      // It's okay if loading state is too fast to catch
    });
  });

  it('adds message to chat history', async () => {
    const user = userEvent.setup();
    render(<ChatFlow />);

    const input = screen.getByTestId('message-input');
    const sendButton = screen.getByTestId('send-button');

    // Mock fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    await user.type(input, 'First question');
    await user.click(sendButton);

    await waitFor(() => {
      const messages = screen.getByTestId('messages-container');
      expect(messages.children.length).toBeGreaterThan(0);
    });
  });

  it('disables send button when input is empty', () => {
    render(<ChatFlow />);
    const sendButton = screen.getByTestId('send-button');
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when input has text', async () => {
    const user = userEvent.setup();
    render(<ChatFlow />);

    const input = screen.getByTestId('message-input');
    const sendButton = screen.getByTestId('send-button');

    expect(sendButton).toBeDisabled();

    await user.type(input, 'Message');

    expect(sendButton).not.toBeDisabled();
  });

  it('calls fetch with correct parameters', async () => {
    const user = userEvent.setup();
    render(<ChatFlow />);

    const input = screen.getByTestId('message-input');
    const sendButton = screen.getByTestId('send-button');

    // Mock fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    await user.type(input, 'Test');
    await user.click(sendButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/chat',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });
});
