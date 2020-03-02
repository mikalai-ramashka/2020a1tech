import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { getParamsFromUrl, FilterInfo } from '../context';
import { withRouter, RouteComponentProps } from 'react-router-dom';


interface ICarsFilterProps extends RouteComponentProps {
    filterInfo: FilterInfo;
}

class CarsFilter extends React.Component<ICarsFilterProps, {
    color?: string;
    manufacturer?: string;
}> {
    constructor(props: any) {
        super(props);

        this.search = this.search.bind(this);
        this.state = {
        };
    }

    componentDidMount() {
        const r = getParamsFromUrl(this.props.location.search);

        this.setState({
            color: r.get('color'),
            manufacturer: r.get('manufacturer')
        });
    }

    componentDidUpdate(prevProps: any) {
        if (prevProps.location !== this.props.location) {
            const r = getParamsFromUrl(this.props.location.search);

            this.setState({
                color: r.get('color') || '',
                manufacturer: r.get('manufacturer') || ''
            });
        }
    }

    setColor(color: string) {
        this.setState({ color: color });
    }

    setManufacturer(manufacturer: string) {
        this.setState({ manufacturer: manufacturer });
    }

    search(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault();

        const params = getParamsFromUrl(this.props.location.search);
        params.set('page', 1);
        params.set('color', this.state.color);
        params.set('manufacturer', this.state.manufacturer);

        const url = `?${Array.from(params).filter((p) => p[1]).map((p) => `${p[0]}=${encodeURIComponent(p[1])}`).join('&')}`;

        this.props.history.push(url);
    };

    render() {
        return (
            <Form className="clearfix mb-0">
                <Form.Group controlId="color">
                    <Form.Label className="h5">Color</Form.Label>
                    <Form.Control key={`${this.props.location.key}-c`} as="select" value={this.state.color} onChange={(e) => this.setColor(e.currentTarget.value)}>
                        <option key='' value=''>All car colors</option>
                        {this.props.filterInfo.colors.map((c) => <option key={c} value={c}>{c}</option>)}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="manufacturer">
                    <Form.Label className="h5">Manufacturer</Form.Label>
                    <Form.Control key={`${this.props.location.key}-m`} as="select" value={this.state.manufacturer} onChange={(e) => this.setManufacturer(e.currentTarget.value)}>
                        <option key='' value=''>All manufacturers</option>
                        {this.props.filterInfo.manufacturers.map((c) => <option key={c} value={c}>{c}</option>)}
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" className="float-right" onClick={this.search}>
                    Submit
                </Button>
            </Form>
          );
    }
}

const CarsFilterWithRouter = withRouter(CarsFilter);

export { CarsFilterWithRouter as CarsFilter };