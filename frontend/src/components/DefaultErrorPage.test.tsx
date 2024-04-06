import { render, screen } from '@testing-library/react';
import DefaultErrorPage from './DefaultErrorPage';
import { test, expect } from 'vitest';

test('renders DefaultErrorPage', () => {
  render(<DefaultErrorPage title="Error" body="Uh oh!" />);
  const linkElement = screen.getByText(/Error/i);
  expect(linkElement).toBeTruthy();
});
