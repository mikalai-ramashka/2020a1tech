import React from 'react';
import { render } from '@testing-library/react';
import { Header } from './header';
import { MemoryRouter } from 'react-router-dom';

test('render header', () => {
  let r = render(
    <MemoryRouter>
      <Header orders={0} />
    </MemoryRouter>
  );
  let linkElement = r.getByText(/Purchase/i) as HTMLAnchorElement;
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href', '/');

  linkElement = r.getByText(/My Orders/i) as HTMLAnchorElement;
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href', '/orders');
  expect(linkElement).toHaveTextContent('My Orders')

  linkElement = r.getByText(/Sell/i) as HTMLAnchorElement;
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href', '/sell');
  r.unmount();

  r = render(
    <MemoryRouter>
      <Header orders={2} />
    </MemoryRouter>
  );

  linkElement = r.getByText(/My Orders/i) as HTMLAnchorElement;
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href', '/orders');
  expect(linkElement).toHaveTextContent('My Orders 2')
});
