import React, { ReactNode, ReactNodeArray } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getParamsFromUrl } from '../context';
import { LinkContainer } from 'react-router-bootstrap';

function useQuery() {
    const url = useLocation().search;

    return getParamsFromUrl(url);
}

function useSearch(page: number) {
    let params = useQuery();
    params.set('page', `${page}`);
    
    return `/?${Array.from(params).filter((p) => p[1]).map((p) => `${p[0]}=${encodeURIComponent(p[1])}`).join('&')}`;
}

export function Pager(props: {
    currentPage: number;
    totalPages: number;
    children?: ReactNode | ReactNodeArray;
}) {
    const prev = useSearch(props.currentPage - 1);
    const next = useSearch(props.currentPage + 1);

    return (
        <Container fluid>
            <Row>
                <Col xs={12}>
                    {props.children}
                </Col>
            </Row>
            <Row>
                <Col xs={12} className='text-center'>
                   <p className="h5">
                       <LinkContainer to={useSearch(1)}>
                            <a className="m-2">First</a>
                       </LinkContainer>
                       {props.currentPage > 1 ? <LinkContainer to={prev}><a className="m-2">Previous</a></LinkContainer> : <a className="m-2">Previous</a>}
                       <span className="m-2">
                           Page {props.currentPage} of {props.totalPages}
                       </span>
                       {props.currentPage < props.totalPages ? <LinkContainer to={next}><a className="m-2">Next</a></LinkContainer> : <a className="m-2">Next</a>}
                       <LinkContainer to={useSearch(props.totalPages)}>
                            <a className="m-2">Last</a>
                       </LinkContainer>
                   </p>
                </Col>
            </Row>
        </Container>
      );
}
