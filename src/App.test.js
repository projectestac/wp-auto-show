import { render, screen } from '@testing-library/react';
import App from './App';

test('renders EUPL link', () => {
  render(<App />);
  const linkElement = screen.getByText(/European Union Public License/i);
  expect(linkElement).toBeInTheDocument();
});
