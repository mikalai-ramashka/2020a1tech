import React from 'react';
import { render } from '@testing-library/react';
import { Pager } from './pager';
import { MemoryRouter } from 'react-router-dom';

test('render links', () => {
  let r = render(
    <MemoryRouter>
      <Pager currentPage={1} totalPages={10} children={<p>1</p>} />
    </MemoryRouter>
  );
  let linkElement = r.getByText(/First/i) as HTMLAnchorElement;
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href');
  expect((linkElement.getAttribute('href') as string).indexOf('page=1') >=0 ).toEqual(true)

  linkElement = r.getByText(/Previous/i) as HTMLAnchorElement;
  expect(linkElement).toBeInTheDocument();
  expect(linkElement.hasAttribute('href')).toEqual(false);

  linkElement = r.getByText(/Next/i) as HTMLAnchorElement;
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href');
  expect((linkElement.getAttribute('href') as string).indexOf('page=2') >=0 ).toEqual(true)

  linkElement = r.getByText(/Last/i) as HTMLAnchorElement;
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href');
  expect((linkElement.getAttribute('href') as string).indexOf('page=10') >=0 ).toEqual(true)
});

test('render children', () => {
    let r = render(
      <MemoryRouter>
        <Pager currentPage={1} totalPages={10} children={<p className="test">children</p>} />
      </MemoryRouter>
    );
    let linkElement = r.getByText(/children/i) as HTMLAnchorElement;
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveTextContent('children');
});