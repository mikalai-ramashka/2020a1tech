import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Logo } from '../logo/logo';
import { LinkContainer } from 'react-router-bootstrap';
import './404.scss';

export function Page404() {
  return (
    <Container className="text-center page-404" fluid>
        <Row>
          <Col>
            <p className="mb-4" style={{marginTop: 96}}>
              <Logo></Logo>
            </p>
            <h1 className="mb-4">404 - Not Found</h1>
            <p className="h3 mb-4">Sorry, the page you are looking for does not exist.</p>
            <p className="h3">You can always go back to the <LinkContainer to="/"><a>homepage</a></LinkContainer>.</p>
          </Col>
        </Row>
    </Container>
  );
}
