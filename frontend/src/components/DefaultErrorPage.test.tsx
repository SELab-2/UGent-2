import { render, screen } from '@testing-library/react';
import DefaultErrorPage from './DefaultErrorPage';
import { test, expect } from 'vitest';

test('renders DefaultErrorPage', () => {
  render(<DefaultErrorPage title="Error" body="Uh oh!" />);
  const titleElement = screen.getByText(/Error/i);
  expect(titleElement).toBeTruthy();
  const bodyElement = screen.getByText(/Uh oh!/i);
  expect(bodyElement).toBeTruthy();
});
