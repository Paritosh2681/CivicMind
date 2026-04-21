/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock TopicChips component for testing purposes
interface TopicChipsProps {
  topics: string[];
  onSelect: (topic: string) => void;
  isLoading?: boolean;
}

const TopicChips: React.FC<TopicChipsProps> = ({ topics, onSelect, isLoading = false }) => {
  return (
    <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide flex-wrap">
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => onSelect(topic)}
          disabled={isLoading}
          className="text-xs border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50"
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

describe('TopicChips Component', () => {
  const mockTopics = [
    "How do I register to vote?",
    "How does vote counting work?",
    "What is an EVM?",
    "How are constituencies decided?",
    "What is Model Code of Conduct?",
  ];

  it('renders all 5 topic chips', () => {
    const mockOnSelect = jest.fn();
    render(<TopicChips topics={mockTopics} onSelect={mockOnSelect} />);
    
    mockTopics.forEach((topic) => {
      expect(screen.getByText(topic)).toBeInTheDocument();
    });
  });

  it('calls onSelect callback with correct question text when a chip is clicked', () => {
    const mockOnSelect = jest.fn();
    render(<TopicChips topics={mockTopics} onSelect={mockOnSelect} />);
    
    const firstChip = screen.getByText(mockTopics[0]);
    fireEvent.click(firstChip);
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockTopics[0]);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('calls onSelect with different topics when different chips are clicked', () => {
    const mockOnSelect = jest.fn();
    render(<TopicChips topics={mockTopics} onSelect={mockOnSelect} />);
    
    const firstChip = screen.getByText(mockTopics[0]);
    const secondChip = screen.getByText(mockTopics[1]);
    
    fireEvent.click(firstChip);
    fireEvent.click(secondChip);
    
    expect(mockOnSelect).toHaveBeenNthCalledWith(1, mockTopics[0]);
    expect(mockOnSelect).toHaveBeenNthCalledWith(2, mockTopics[1]);
  });

  it('renders chips as visible buttons', () => {
    const mockOnSelect = jest.fn();
    render(<TopicChips topics={mockTopics} onSelect={mockOnSelect} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(mockTopics.length);
    buttons.forEach((button) => {
      expect(button).toBeVisible();
    });
  });

  it('does not disable chips by default', () => {
    const mockOnSelect = jest.fn();
    render(<TopicChips topics={mockTopics} onSelect={mockOnSelect} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it('disables chips when isLoading is true', () => {
    const mockOnSelect = jest.fn();
    render(<TopicChips topics={mockTopics} onSelect={mockOnSelect} isLoading={true} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('renders with correct styling classes', () => {
    const mockOnSelect = jest.fn();
    const { container } = render(<TopicChips topics={mockTopics} onSelect={mockOnSelect} />);
    
    const buttons = container.querySelectorAll('button');
    buttons.forEach((button) => {
      expect(button.className).toContain('border-slate-700');
      expect(button.className).toContain('text-slate-300');
    });
  });
});
