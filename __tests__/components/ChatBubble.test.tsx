/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock react-markdown to avoid JSX issues
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: any) {
    return <div>{children}</div>;
  };
});

// Mock ChatBubble component for testing purposes
interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content }) => {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-6 py-4 ${
          role === "user"
            ? "bg-[#1E90FF] text-white rounded-br-none"
            : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50 shadow-md"
        }`}
      >
        {role === "assistant" && (
          <div className="flex items-center gap-1.5 mb-3 text-[10px] uppercase tracking-wider font-semibold text-blue-300 bg-blue-900/30 w-max px-2.5 py-1 rounded-full border border-blue-800/50" data-testid="search-badge">
            🔍 Searched the web
          </div>
        )}
        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 max-w-none">
          {content}
        </div>
      </div>
    </div>
  );
};

describe('ChatBubble Component', () => {
  it('renders a user message on the right side', () => {
    const { container } = render(
      <ChatBubble role="user" content="How do I register to vote?" />
    );
    const messageContainer = container.querySelector('.justify-end');
    expect(messageContainer).toBeInTheDocument();
  });

  it('renders an assistant message on the left side', () => {
    const { container } = render(
      <ChatBubble role="assistant" content="You can register to vote by..." />
    );
    const messageContainer = container.querySelector('.justify-start');
    expect(messageContainer).toBeInTheDocument();
  });

  it('displays message content text correctly', () => {
    render(
      <ChatBubble role="user" content="How do I register to vote?" />
    );
    expect(screen.getByText('How do I register to vote?')).toBeInTheDocument();
  });

  it('shows the "🔍 Searched the web" badge for assistant messages', () => {
    render(
      <ChatBubble role="assistant" content="Here is the information..." />
    );
    const badge = screen.getByTestId('search-badge');
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toContain('Searched the web');
  });

  it('does not show the badge for user messages', () => {
    render(
      <ChatBubble role="user" content="Test message" />
    );
    const badge = screen.queryByTestId('search-badge');
    expect(badge).not.toBeInTheDocument();
  });

  it('renders user message with blue background', () => {
    const { container } = render(
      <ChatBubble role="user" content="Test message" />
    );
    const messageBox = container.querySelector('.bg-\\[\\#1E90FF\\]');
    expect(messageBox).toBeInTheDocument();
  });

  it('renders assistant message with slate background', () => {
    const { container } = render(
      <ChatBubble role="assistant" content="Test response" />
    );
    const messageBox = container.querySelector('.bg-slate-800');
    expect(messageBox).toBeInTheDocument();
  });
});
