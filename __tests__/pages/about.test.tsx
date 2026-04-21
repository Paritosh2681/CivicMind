/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutPage from '@/app/about/page';

describe('About Page', () => {
  it('renders without crashing', () => {
    const { container } = render(<AboutPage />);
    expect(container).toBeTruthy();
  });

  it('contains the text "CivicMind"', () => {
    render(<AboutPage />);
    const headings = screen.queryAllByText(/CivicMind/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  it('displays the About heading', () => {
    render(<AboutPage />);
    const aboutHeading = screen.getByText('About CivicMind');
    expect(aboutHeading).toBeInTheDocument();
  });

  it('displays "The Problem" section', () => {
    render(<AboutPage />);
    const problemSection = screen.getByText('The Problem');
    expect(problemSection).toBeInTheDocument();
  });

  it('displays "How CivicMind Works" section', () => {
    render(<AboutPage />);
    const howItWorks = screen.getByText('How CivicMind Works');
    expect(howItWorks).toBeInTheDocument();
  });

  it('displays "Our Mission" section', () => {
    render(<AboutPage />);
    const mission = screen.getByText('Our Mission');
    expect(mission).toBeInTheDocument();
  });

  it('contains description text about AI-powered assistance', () => {
    render(<AboutPage />);
    const descText = screen.getByText(/AI-powered Election Process Education assistant/i);
    expect(descText).toBeInTheDocument();
  });

  it('mentions Tavily Search API', () => {
    render(<AboutPage />);
    const tavilyText = screen.getByText(/Tavily Search API/i);
    expect(tavilyText).toBeInTheDocument();
  });

  it('mentions Google Gemini', () => {
    render(<AboutPage />);
    const geminiText = screen.getByText(/Google Gemini/i);
    expect(geminiText).toBeInTheDocument();
  });

  it('mentions Supabase', () => {
    render(<AboutPage />);
    const supabaseText = screen.getByText(/Supabase/i);
    expect(supabaseText).toBeInTheDocument();
  });

  it('contains election-related keywords', () => {
    render(<AboutPage />);
    expect(screen.getByText(/election/i)).toBeInTheDocument();
  });
});
