import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './footer';

test('render footer', () => {
  let r = render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
  let linkElement = r.getByText(/AUTO1/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveTextContent('© AUTO1 Group 2018');
});
