import { render, screen } from '@testing-library/react';
import App from './App';

test('renders EUPL link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Llicència Pública de la Unió Europea/i);
  expect(linkElement).toBeInTheDocument();
});
