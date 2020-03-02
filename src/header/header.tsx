import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './header.scss'
import { Logo } from '../logo/logo';

export function Header() {
  return (
    <Navbar className="header">
        <Navbar.Brand>
          <Logo></Logo>
        </Navbar.Brand>
        <Nav className="ml-auto">
          <LinkContainer to="/">
            <Nav.Link className="h5">Purchase</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/orders">
            <Nav.Link className="h5">My Orders</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/sell">
            <Nav.Link className="h5">Sell</Nav.Link>
          </LinkContainer>
        </Nav>
    </Navbar>
  );
}
