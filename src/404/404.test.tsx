import React from 'react';
import { render } from '@testing-library/react';
import { Page404 } from '.';
import { MemoryRouter } from 'react-router-dom';

test('renders homepage link', () => {
  const { getByText } = render(
    <MemoryRouter>
      <Page404 />
    </MemoryRouter>
  );
  const linkElement = getByText(/homepage/i) as HTMLAnchorElement;
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href', '/');
});
