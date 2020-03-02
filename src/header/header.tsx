import React, { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './header.scss'
import { Logo } from '../logo/logo';
import { useObserver } from 'mobx-react';
import { CarsStore, Context } from '../context';

export function Header() {
  const context = useContext<CarsStore>(Context);

  return useObserver(() => (
    <Navbar className="header">
        <Navbar.Brand>
          <Logo></Logo>
        </Navbar.Brand>
        <Nav className="ml-auto">
          <LinkContainer to="/">
            <Nav.Link className="h5">Purchase</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/orders">
            <Nav.Link className="h5">
              My Orders&nbsp;
              {context.orders.length > 0 && <span className="badge badge-primary">{context.orders.length}</span>}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/sell">
            <Nav.Link className="h5">Sell</Nav.Link>
          </LinkContainer>
        </Nav>
    </Navbar>
  ));
}
