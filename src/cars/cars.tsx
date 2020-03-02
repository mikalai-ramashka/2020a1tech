import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './cars.scss';
import { CarsFilter } from '../carsFilter';
import { Pager } from '../pager';
import { ICar, IOrder, getParamsFromUrl, FilterInfo } from '../context';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

interface CarsProps extends RouteComponentProps {
    totalPages: number;
    page: number;
    totalItems: number;
    loading: boolean;
    items: ICar[];
    filterInfo: FilterInfo;
    onLoad(page: number, manufacturer: string, color: string): void;
}

class Cars extends React.Component<CarsProps> {
    load() {
        const r = getParamsFromUrl(this.props.location.search);

        this.props.onLoad(r.get('page'), r.get('manufacturer'), r.get('color'));
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate(prevProps: any) {
        if (prevProps.location !== this.props.location) {
            this.load();
        }
    }

    get showing() {
        const pageSize = 10;

        if (this.props.page < this.props.totalPages) {
            if (this.props.page === 1) {
                return `${pageSize} of ${this.props.totalItems}`;
            } else {
                return `${pageSize * (this.props.page - 1)} - ${pageSize * this.props.page} of ${this.props.totalItems}`;
            }
        } else {
            return `${pageSize * (this.props.page - 1)} - ${Math.min(pageSize * this.props.page, this.props.totalItems)} of ${this.props.totalItems}`;
        }
    }

    render() {
        return (
            <Container className="cars" fluid>
                <Row>
                    <Col md={4} className="pt-4 pb-4">
                        <div className="card">
                            <div className="card-body">
                                <CarsFilter filterInfo={this.props.filterInfo}></CarsFilter>
                            </div>
                        </div>
                    </Col>
                    <Col md={8} className="pt-4 pb-4">
                        <Pager 
                            currentPage={this.props.page} 
                            totalPages={this.props.totalPages}>
                            {this.props.loading ? <p className='h1' style={{marginBottom: 31}}>Loading</p> : <p className='h3'>Available cars</p>}
                            {!this.props.loading && <p className='h5 mb-4'>Showing {this.showing} results</p>}
                            <CarsList cars={this.props.items} isLoading={this.props.loading}></CarsList>
                        </Pager>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export function CarsList(props: {
    cars: ICar[];   
    isLoading: boolean;
}) {

    return <React.Fragment>{props.cars.map((c) => <CarInfo key={c.stockNumber} isLoading={props.isLoading} car={c}></CarInfo>)}</React.Fragment>;
}

export function CarInfo(props: {
    car: ICar;
    isLoading: boolean;
}) {
    const car = props.car;
    const className = `car-card card mb-2 ${props.isLoading ? 'loading' : ''}`;

    return (<div className={className}>
        <div className="row no-gutters">
            <div className="col-lg-1 p-2">
                <div className='wrapper load-content'>
                    <img src={car.pictureUrl} className="card-img" alt="Car"/>
                </div>
            </div>
            <div className="col-lg-11">
                <div className="card-body p-2">
                    <h3 className="card-title"><span className="load-content">{car.manufacturerName} {car.modelName}</span></h3>
                    <p className="card-text h5 mb-2">
                        <span className="load-content">
                            Stock # {car.stockNumber} - {car.mileage.number} {car.mileage.unit} - {car.fuelType} - {car.color}
                        </span>
                    </p>
                    <p className="card-text h5"><LinkContainer to={`/car/${car.stockNumber}`}><a><span className="load-content">View details</span></a></LinkContainer></p>
                </div>
            </div>
        </div>
    </div>)
}

const CarswithRouter = withRouter(Cars);

export { CarswithRouter as Cars };

interface CarDetailsProps extends RouteComponentProps<{ id: string }> {
    loadCar(id: string): void;
    loading: boolean;
    order(): void;
    car: ICar;
}

class CarDetails extends React.Component<CarDetailsProps> {
    constructor(props: any) {
        super(props);

        this.save = this.save.bind(this);
    }

    load() {
        this.props.loadCar(this.props.match.params.id);
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate(prevProps: any) {
        if (prevProps.location !== this.props.location) {
            this.load();
        }
    }

    save() {
        this.props.order();
    }

    renderCarInfo() {
        if (this.props.loading) {
            return (<p className="h1 mt-4 mb-4">
                Loading
            </p>);
        }

        const car = this.props.car;

        return (<React.Fragment>
            <p className="h1 mt-4 mb-4">
                <span className="load-content">{car.manufacturerName} {car.modelName}</span>
            </p>
            <p className="h3 mb-2">
                <span className="load-content">
                    Stock # {car.stockNumber} - {car.mileage.number} {car.mileage.unit} - {car.fuelType} - {car.color}
                </span>
            </p>
            <p className="h5 mb-2">
                <span className="load-content">
                    This car is currently available and can be delivered as soon as tomorrow morning. Please be aware that delivery times shown in this page are not definitive and amy change due to bad weather conditions.
                </span>
            </p>
        </React.Fragment>);
    }

    render() {
        return (
            <Container className="car-details" fluid>
                <Row className="no-gutters">
                    <Col xs={12}>
                        <div className="photos"></div>
                        <div style={{maxWidth: 800}} className="m-auto">
                            <Container>
                                <Row>
                                    <Col md="7">
                                        {this.renderCarInfo()}
                                    </Col>
                                    <Col md="5">
                                        <div className='card mt-4 mb-4'>
                                            <div className='card-body'>
                                                <p className='h5'>
                                                    If you like this car, click the button and save it in your collection of favourite items.
                                                </p>
                                                <p>
                                                    <Button variant="primary" disabled={this.props.loading} type="button" className="float-right" onClick={this.save}>
                                                        Save
                                                    </Button>
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const CarDetailswithRouter = withRouter(CarDetails);

export { CarDetailswithRouter as CarDetails };

interface CarOdersProps {
    remove(order: IOrder): void;
    orders: IOrder[];
}

export class CarOders extends React.Component<CarOdersProps> {
    constructor(props: any) {
        super(props);

        this.remove = this.remove.bind(this);
    }

    remove(order: IOrder) {
        this.props.remove(order);
    }

    render() {
        return (
            <Container className="border-top" fluid>
                <Row>
                    <Col>
                        <div style={{width: 800}} className="m-auto ">
                            <Container className="mt-4 mb-4" fluid>
                                {!this.props.orders.length && <Row><Col><p className="h3">No orders</p></Col></Row>}
                                {this.props.orders.map((order) => (
                                    <Row key={order.id}>
                                        <Col lg="12" className="clearfix">
                                            <CarInfo car={order.car} isLoading={false}></CarInfo>
                                            <Button variant="primary" type="button" className="float-right mb-4" 
                                                onClick={() => this.remove(order)}>
                                                Remove
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                               
                            </Container>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}