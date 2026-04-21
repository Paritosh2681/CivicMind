/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock all dependencies before importing Navbar
jest.mock('next/link', () => {
  return ({ children, href }: any) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/',
}));

jest.mock('lucide-react', () => ({
  LogIn: () => <span data-testid="icon-login">LogIn</span>,
  LogOut: () => <span data-testid="icon-logout">LogOut</span>,
  Menu: () => <span data-testid="icon-menu">Menu</span>,
}));

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      }),
    },
  }),
}));

jest.mock('@/lib/auth', () => ({
  signOut: jest.fn(),
}));

import Navbar from '@/components/Navbar';

describe('Navbar Component', () => {
  it('renders without crashing', async () => {
    const { container } = render(<Navbar />);
    expect(container).toBeTruthy();
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it('renders the CivicMind brand name', async () => {
    render(<Navbar />);
    await new Promise(resolve => setTimeout(resolve, 100));
    const brandName = screen.getByText('CivicMind', { selector: 'span' });
    expect(brandName).toBeInTheDocument();
  });

  it('renders the About nav link', async () => {
    render(<Navbar />);
    await new Promise(resolve => setTimeout(resolve, 100));
    const aboutLink = screen.getByText('About');
    expect(aboutLink).toBeInTheDocument();
  });

  it('has navigation links', async () => {
    const { container } = render(<Navbar />);
    await new Promise(resolve => setTimeout(resolve, 100));
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });
});
