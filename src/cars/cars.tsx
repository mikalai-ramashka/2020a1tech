import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './cars.scss';
import { CarsFilter } from '../carsFilter';
import { Pager } from '../pager';
import { Context, ICar, IOrder } from '../context';
import { observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

@observer
class Cars extends React.Component<RouteComponentProps> {
    static contextType = Context;
    context!: React.ContextType<typeof Context>

    load() {
        const r = this.context.getParamsFromUrl(this.props.location.search);

        this.context.load(r.get('page'), r.get('manufacturer'), r.get('color'));
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

        if (this.context.pageInfo.page < this.context.pageInfo.totalPages) {
            if (this.context.pageInfo.page === 1) {
                return `${pageSize} of ${this.context.pageInfo.totalItems}`;
            } else {
                return `${pageSize * (this.context.pageInfo.page - 1)} - ${pageSize * this.context.pageInfo.page} of ${this.context.pageInfo.totalItems}`;
            }
        } else {
            return `${pageSize * (this.context.pageInfo.page - 1)} - ${Math.min(pageSize * this.context.pageInfo.page, this.context.pageInfo.totalItems)} of ${this.context.pageInfo.totalItems}`;
        }
    }

    render() {
        return (
            <Container className="cars" fluid>
                <Row>
                    <Col md={4} className="pt-4 pb-4">
                        <div className="card">
                            <div className="card-body">
                                <CarsFilter></CarsFilter>
                            </div>
                        </div>
                    </Col>
                    <Col md={8} className="pt-4 pb-4">
                        <Pager 
                            currentPage={this.context.pageInfo.page} 
                            totalPages={this.context.pageInfo.totalPages} 
                            loading = {this.context.pageInfo.loading}>
                            {this.context.pageInfo.loading ? <p className='h1' style={{marginBottom: 31}}>Loading</p> : <p className='h3'>Available cars</p>}
                            {!this.context.pageInfo.loading && <p className='h5 mb-4'>Showing {this.showing} results</p>}
                            <CarsList cars={this.context.pageInfo.items} isLoading={this.context.pageInfo.loading}></CarsList>
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
                    <img src={car.pictureUrl} className="card-img" alt="Picture"/>
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

@observer
class CarDetails extends React.Component<RouteComponentProps<{ id: string }>> {
    static contextType = Context;
    context!: React.ContextType<typeof Context>

    constructor(props: any) {
        super(props);

        this.save = this.save.bind(this);
    }

    load() {
        this.context.loadCar(this.props.match.params.id);
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
        this.context.orderSelectedCar();
    }

    renderCarInfo() {
        if (this.context.isSelectedCarLoading) {
            return (<p className="h1 mt-4 mb-4">
                Loading
            </p>);
        }

        const car = this.context.selectedCar;

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
                                                    <Button variant="primary" disabled={this.context.isSelectedCarLoading} type="button" className="float-right" onClick={this.save}>
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


@observer
export class CarOders extends React.Component {
    static contextType = Context;
    context!: React.ContextType<typeof Context>

    constructor(props: any) {
        super(props);

        this.remove = this.remove.bind(this);
    }

    remove(order: IOrder) {
        this.context.removeOrderedCar(order);
    }

    render() {
        return (
            <Container className="border-top" fluid>
                <Row>
                    <Col>
                        <div style={{width: 800}} className="m-auto ">
                            <Container className="mt-4 mb-4" fluid>
                                {!this.context.orders.length && <Row><Col><p className="h3">No orders</p></Col></Row>}
                                {this.context.orders.map((order) => (
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